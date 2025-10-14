/**
 * State Persistence and Recovery System
 *
 * Provides advanced state persistence with:
 * - Multiple storage backends (localStorage, sessionStorage, IndexedDB)
 * - Compression and encryption support
 * - Migration system for schema changes
 * - Backup and restore functionality
 * - Automatic cleanup and quota management
 */

import type { StateValue } from './state-manager';

// ============================================================================
// Type Definitions
// ============================================================================

export type StorageBackend = 'localStorage' | 'sessionStorage' | 'indexedDB' | 'memory';

export interface PersistenceConfig {
  backend: StorageBackend;
  key: string;
  version: number;
  compression?: boolean;
  encryption?: {
    enabled: boolean;
    key?: string;
  };
  migration?: {
    currentVersion: number;
    migrate: (data: any, fromVersion: number, toVersion: number) => any;
  };
  backup?: {
    enabled: boolean;
    interval?: number; // minutes
    maxBackups?: number;
  };
  cleanup?: {
    enabled: boolean;
    maxAge?: number; // days
    maxQuota?: number; // percentage
  };
}

export interface StorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  getQuota(): Promise<{ used: number; available: number }>;
  listKeys(): Promise<string[]>;
}

export interface BackupInfo {
  id: string;
  timestamp: number;
  version: number;
  size: number;
  compressed: boolean;
  encrypted: boolean;
}

export interface MigrationResult {
  success: boolean;
  fromVersion: number;
  toVersion: number;
  dataMigrated: boolean;
  errors?: string[];
}

// ============================================================================
// Compression Utilities
// ============================================================================

class StateCompressor {
  static async compress(data: string): Promise<string> {
    if ('CompressionStream' in window) {
      const stream = new CompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();

      writer.write(new TextEncoder().encode(data));
      writer.close();

      const chunks: Uint8Array[] = [];
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }

      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
      }

      // Convert to base64 for storage
      return btoa(String.fromCharCode(...compressed));
    }

    // Fallback: simple compression using repeated patterns
    return this.simpleCompress(data);
  }

  static async decompress(compressedData: string): Promise<string> {
    if ('DecompressionStream' in window) {
      try {
        const compressed = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0));
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();

        writer.write(compressed);
        writer.close();

        const chunks: Uint8Array[] = [];
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) chunks.push(value);
        }

        const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
        let offset = 0;
        for (const chunk of chunks) {
          decompressed.set(chunk, offset);
          offset += chunk.length;
        }

        return new TextDecoder().decode(decompressed);
      } catch (error) {
        console.warn('Failed to decompress with gzip, trying fallback:', error);
      }
    }

    // Fallback
    return this.simpleDecompress(compressedData);
  }

  private static simpleCompress(data: string): string {
    // Simple compression using dictionary replacement
    const dict: Record<string, string> = {
      'true': '1',
      'false': '0',
      'null': 'n',
      'undefined': 'u',
      '"': "'",
      '{': '{',
      '}': '}',
      '[': '[',
      ']': ']',
      ',': ',',
      ':': ':'
    };

    let compressed = data;
    for (const [key, value] of Object.entries(dict)) {
      compressed = compressed.split(key).join(value);
    }

    return compressed;
  }

  private static simpleDecompress(compressedData: string): string {
    const dict: Record<string, string> = {
      '1': 'true',
      '0': 'false',
      'n': 'null',
      'u': 'undefined'
    };

    let decompressed = compressedData;
    for (const [key, value] of Object.entries(dict)) {
      decompressed = decompressed.split(key).join(value);
    }

    return decompressed;
  }
}

// ============================================================================
// Encryption Utilities
// ============================================================================

class StateEncryptor {
  private static async generateKey(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('state-manager-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encrypt(data: string, password?: string): Promise<string> {
    if (!password) return data; // No encryption if no password provided

    try {
      const key = await this.generateKey(password);
      const encoder = new TextEncoder();
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        encoder.encode(data)
      );

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data; // Fallback to unencrypted
    }
  }

  static async decrypt(encryptedData: string, password?: string): Promise<string> {
    if (!password) return encryptedData;

    try {
      const key = await this.generateKey(password);
      const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));

      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData; // Fallback to encrypted data
    }
  }
}

// ============================================================================
// Storage Adapters
// ============================================================================

class LocalStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<any> {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }

  async getQuota(): Promise<{ used: number; available: number }> {
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        used += localStorage.getItem(key)?.length || 0;
      }
    }

    // localStorage typically has 5-10MB limit
    const estimated = 5 * 1024 * 1024; // 5MB
    return { used, available: estimated - used };
  }

  async listKeys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }
}

class SessionStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<any> {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any): Promise<void> {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  async remove(key: string): Promise<void> {
    sessionStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    sessionStorage.clear();
  }

  async getQuota(): Promise<{ used: number; available: number }> {
    let used = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        used += sessionStorage.getItem(key)?.length || 0;
      }
    }

    const estimated = 5 * 1024 * 1024; // 5MB
    return { used, available: estimated - used };
  }

  async listKeys(): Promise<string[]> {
    const keys: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) keys.push(key);
    }
    return keys;
  }
}

class IndexedDBAdapter implements StorageAdapter {
  private dbName: string;
  private storeName: string;
  private db: IDBDatabase | null = null;

  constructor(dbName = 'StateDB', storeName = 'state-store') {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  private async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async get(key: string): Promise<any> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.value || null);
    });
  }

  async set(key: string, value: any): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ key, value });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async remove(key: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async getQuota(): Promise<{ used: number; available: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0)
      };
    }

    // Fallback estimation
    return { used: 0, available: 50 * 1024 * 1024 }; // 50MB fallback
  }

  async listKeys(): Promise<string[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as string[]);
    });
  }
}

class MemoryAdapter implements StorageAdapter {
  private store: Map<string, any> = new Map();

  async get(key: string): Promise<any> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: any): Promise<void> {
    this.store.set(key, value);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async getQuota(): Promise<{ used: number; available: number }> {
    let used = 0;
    for (const [key, value] of this.store) {
      used += key.length + JSON.stringify(value).length;
    }

    return { used, available: Number.MAX_SAFE_INTEGER };
  }

  async listKeys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }
}

// ============================================================================
// Migration System
// ============================================================================

export class StateMigration {
  static async migrate(data: any, config: PersistenceConfig): Promise<MigrationResult> {
    const { migration } = config;
    if (!migration) {
      return { success: true, fromVersion: config.version, toVersion: config.version, dataMigrated: false };
    }

    try {
      const dataVersion = data._version || 1;

      if (dataVersion === migration.currentVersion) {
        return { success: true, fromVersion: dataVersion, toVersion: migration.currentVersion, dataMigrated: false };
      }

      if (dataVersion > migration.currentVersion) {
        console.warn(`Data version (${dataVersion}) is newer than expected (${migration.currentVersion})`);
        return { success: true, fromVersion: dataVersion, toVersion: dataVersion, dataMigrated: false };
      }

      const errors: string[] = [];
      let migratedData = { ...data };

      for (let version = dataVersion; version < migration.currentVersion; version++) {
        try {
          migratedData = migration.migrate(migratedData, version, version + 1);
          migratedData._version = version + 1;
        } catch (error) {
          const errorMsg = `Migration from v${version} to v${version + 1} failed: ${error}`;
          errors.push(errorMsg);
          console.error(errorMsg);
        }
      }

      return {
        success: errors.length === 0,
        fromVersion: dataVersion,
        toVersion: migration.currentVersion,
        dataMigrated: errors.length === 0,
        errors: errors.length > 0 ? errors : []
      };
    } catch (error) {
      return {
        success: false,
        fromVersion: data._version || 1,
        toVersion: migration.currentVersion,
        dataMigrated: false,
        errors: [`Migration failed: ${error}`]
      };
    }
  }
}

// ============================================================================
// Backup System
// ============================================================================

export class StateBackup {
  private static BACKUP_KEY_PREFIX = 'state-backup-';

  static async createBackup(
    data: any,
    config: PersistenceConfig,
    backupId?: string
  ): Promise<BackupInfo> {
    const id = backupId || this.generateBackupId();
    const timestamp = Date.now();

    const backupData = {
      id,
      timestamp,
      version: config.version,
      data,
      metadata: {
        compressed: config.compression || false,
        encrypted: config.encryption?.enabled || false,
        size: JSON.stringify(data).length
      }
    };

    const backupKey = this.BACKUP_KEY_PREFIX + id;
    const adapter = this.getStorageAdapter(config.backend);

    await adapter.set(backupKey, backupData);

    const backupInfo: BackupInfo = {
      id,
      timestamp,
      version: config.version,
      size: backupData.metadata.size,
      compressed: backupData.metadata.compressed,
      encrypted: backupData.metadata.encrypted
    };

    // Cleanup old backups if needed
    if (config.backup?.maxBackups) {
      await this.cleanupOldBackups(config.backend, config.backup.maxBackups);
    }

    return backupInfo;
  }

  static async restoreBackup(backupId: string, backend: StorageBackend): Promise<any> {
    const backupKey = this.BACKUP_KEY_PREFIX + backupId;
    const adapter = this.getStorageAdapter(backend);

    const backupData = await adapter.get(backupKey);
    if (!backupData) {
      throw new Error(`Backup '${backupId}' not found`);
    }

    return backupData.data;
  }

  static async listBackups(backend: StorageBackend): Promise<BackupInfo[]> {
    const adapter = this.getStorageAdapter(backend);
    const keys = await adapter.listKeys();
    const backupKeys = keys.filter(key => key.startsWith(this.BACKUP_KEY_PREFIX));

    const backups: BackupInfo[] = [];
    for (const key of backupKeys) {
      const backupData = await adapter.get(key);
      if (backupData) {
        backups.push({
          id: backupData.id,
          timestamp: backupData.timestamp,
          version: backupData.version,
          size: backupData.metadata.size,
          compressed: backupData.metadata.compressed,
          encrypted: backupData.metadata.encrypted
        });
      }
    }

    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }

  static async deleteBackup(backupId: string, backend: StorageBackend): Promise<void> {
    const backupKey = this.BACKUP_KEY_PREFIX + backupId;
    const adapter = this.getStorageAdapter(backend);
    await adapter.remove(backupKey);
  }

  private static generateBackupId(): string {
    return `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async cleanupOldBackups(backend: StorageBackend, maxBackups: number): Promise<void> {
    const backups = await this.listBackups(backend);
    if (backups.length <= maxBackups) return;

    const backupsToDelete = backups.slice(maxBackups);

    for (const backup of backupsToDelete) {
      await this.deleteBackup(backup.id, backend);
    }
  }

  private static getStorageAdapter(backend: StorageBackend): StorageAdapter {
    switch (backend) {
      case 'localStorage':
        return new LocalStorageAdapter();
      case 'sessionStorage':
        return new SessionStorageAdapter();
      case 'indexedDB':
        return new IndexedDBAdapter();
      case 'memory':
        return new MemoryAdapter();
      default:
        return new LocalStorageAdapter();
    }
  }
}

// ============================================================================
// Main Persistence Manager
// ============================================================================

export class StatePersistenceManager {
  private adapter: StorageAdapter;
  private config: PersistenceConfig;

  constructor(config: PersistenceConfig) {
    this.config = config;
    this.adapter = this.getStorageAdapter(config.backend);
  }

  async save(data: StateValue): Promise<void> {
    try {
      if (data === undefined) {
        throw new Error('Cannot save undefined state');
      }
      
      let processedData = {
        _version: this.config.version,
        _timestamp: Date.now(),
        data
      };

      // Apply migration if needed
      const migrationResult = await StateMigration.migrate(processedData, this.config);
      if (!migrationResult.success && migrationResult.errors) {
        console.error('State migration failed:', migrationResult.errors);
        throw new Error('State migration failed');
      }

      processedData = (migrationResult.dataMigrated && processedData ? processedData : data) as any;

      // Serialize data
      let serialized = JSON.stringify(processedData);

      // Compress if enabled
      if (this.config.compression) {
        serialized = await StateCompressor.compress(serialized);
      }

      // Encrypt if enabled
      if (this.config.encryption?.enabled) {
        serialized = await StateEncryptor.encrypt(serialized, this.config.encryption.key);
      }

      // Store the data
      await this.adapter.set(this.config.key, {
        compressed: this.config.compression || false,
        encrypted: this.config.encryption?.enabled || false,
        data: serialized
      });

      // Create backup if enabled
      if (this.config.backup?.enabled) {
        await this.createPeriodicBackup(processedData);
      }

    } catch (error) {
      console.error('Failed to save state:', error);
      throw error;
    }
  }

  async load(): Promise<StateValue | null> {
    try {
      const stored = await this.adapter.get(this.config.key);
      if (!stored) return null;

      let data = stored.data;

      // Decrypt if needed
      if (stored.encrypted && this.config.encryption?.enabled) {
        data = await StateEncryptor.decrypt(data, this.config.encryption.key);
      }

      // Decompress if needed
      if (stored.compressed && this.config.compression) {
        data = await StateCompressor.decompress(data);
      }

      const parsedData = JSON.parse(data);

      // Apply migration
      const migrationResult = await StateMigration.migrate(parsedData, this.config);
      if (!migrationResult.success && migrationResult.errors) {
        console.error('State migration failed during load:', migrationResult.errors);
      }

      return migrationResult.dataMigrated ? parsedData.data : parsedData.data || parsedData;

    } catch (error) {
      console.error('Failed to load state:', error);
      return null;
    }
  }

  async remove(): Promise<void> {
    await this.adapter.remove(this.config.key);
  }

  async clear(): Promise<void> {
    await this.adapter.clear();
  }

  async getQuota(): Promise<{ used: number; available: number; percentage: number }> {
    const quota = await this.adapter.getQuota();
    const percentage = quota.available > 0 ? (quota.used / (quota.used + quota.available)) * 100 : 100;
    return { ...quota, percentage };
  }

  async createBackup(backupId?: string): Promise<BackupInfo> {
    const data = await this.load();
    if (!data) {
      throw new Error('No data available to backup');
    }

    return StateBackup.createBackup(data, this.config, backupId);
  }

  async restoreBackup(backupId: string): Promise<void> {
    const data = await StateBackup.restoreBackup(backupId, this.config.backend);
    await this.save(data);
  }

  async listBackups(): Promise<BackupInfo[]> {
    return StateBackup.listBackups(this.config.backend);
  }

  async deleteBackup(backupId: string): Promise<void> {
    await StateBackup.deleteBackup(backupId, this.config.backend);
  }

  private async createPeriodicBackup(data: StateValue): Promise<void> {
    const lastBackupKey = `${this.config.key}-last-backup`;
    const lastBackupTime = await this.adapter.get(lastBackupKey);
    const now = Date.now();
    const interval = (this.config.backup?.interval || 60) * 60 * 1000; // Convert minutes to ms

    if (!lastBackupTime || (now - lastBackupTime) > interval) {
      await StateBackup.createBackup(data, this.config);
      await this.adapter.set(lastBackupKey, now);
    }
  }

  private getStorageAdapter(backend: StorageBackend): StorageAdapter {
    switch (backend) {
      case 'localStorage':
        return new LocalStorageAdapter();
      case 'sessionStorage':
        return new SessionStorageAdapter();
      case 'indexedDB':
        return new IndexedDBAdapter();
      case 'memory':
        return new MemoryAdapter();
      default:
        return new LocalStorageAdapter();
    }
  }
}

export default StatePersistenceManager;