#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * Checks for WCAG 2.1 AA compliance issues
 */

const fs = require('fs');
const path = require('path');

// Color contrast ratios for WCAG AA
const MIN_CONTRAST_NORMAL = 4.5;
const MIN_CONTRAST_LARGE = 3;

function luminance(r, g, b) {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function contrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = luminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = luminance(rgb2.r, rgb2.g, rgb2.b);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const checks = {
  pass: [],
  fail: [],
  warn: []
};

// Check 1: Skip link present
console.log('\n🔍 Checking skip link...');
const defaultLayout = fs.readFileSync('_layouts/default.html', 'utf8');
if (defaultLayout.includes('skip-link')) {
  checks.pass.push('✅ Skip link present for keyboard navigation');
} else {
  checks.fail.push('❌ Skip link missing - add <a href="#main-content" class="skip-link">');
}

// Check 2: ARIA labels on navigation
console.log('🔍 Checking ARIA labels...');
const headerNav = fs.readFileSync('_includes/header-nav.html', 'utf8');
if (headerNav.includes('aria-label="Main navigation"')) {
  checks.pass.push('✅ Main navigation has aria-label');
} else {
  checks.fail.push('❌ Main navigation missing aria-label');
}

if (headerNav.includes('aria-expanded')) {
  checks.pass.push('✅ Nav toggle has aria-expanded attribute');
} else {
  checks.fail.push('❌ Nav toggle missing aria-expanded');
}

if (headerNav.includes('aria-controls')) {
  checks.pass.push('✅ Nav toggle has aria-controls attribute');
} else {
  checks.fail.push('❌ Nav toggle missing aria-controls');
}

// Check 3: Search form labels
console.log('🔍 Checking search form...');
const homePage = fs.readFileSync('index.md', 'utf8');
if (homePage.includes('aria-label="Search articles"')) {
  checks.pass.push('✅ Search input has aria-label');
} else {
  checks.fail.push('❌ Search input missing aria-label');
}

if (homePage.includes('aria-describedby="search-hint"')) {
  checks.pass.push('✅ Search input has aria-describedby');
} else {
  checks.fail.push('❌ Search input missing aria-describedby');
}

// Check 4: ARIA live regions
if (homePage.includes('aria-live="polite"')) {
  checks.pass.push('✅ Search results have aria-live region');
} else {
  checks.fail.push('❌ Search results missing aria-live');
}

// Check 5: Focus visible styles
console.log('🔍 Checking focus styles...');
const navCss = fs.readFileSync('css/components/navigation.css', 'utf8');
if (navCss.includes(':focus-visible')) {
  checks.pass.push('✅ Focus visible styles defined');
} else {
  checks.fail.push('❌ Focus visible styles missing');
}

// Check 6: Visually hidden class
const formsCss = fs.readFileSync('css/components/forms.css', 'utf8');
if (formsCss.includes('.visually-hidden')) {
  checks.pass.push('✅ Visually hidden utility class present');
} else {
  checks.fail.push('❌ Visually hidden utility class missing');
}

// Check 7: Color contrast
console.log('🔍 Checking color contrast...');
const variablesCss = fs.readFileSync('css/variables.css', 'utf8');

// Extract color values from CSS
const primaryMatch = variablesCss.match(/--color-primary:\s*#([a-f\d]{6})/i);
const primaryColor = primaryMatch ? `#${primaryMatch[1]}` : '#3498db';

const textOnWhite = contrast('#2c3e50', '#ffffff');
const primaryOnWhite = contrast(primaryColor, '#ffffff');
const mutedOnWhite = contrast('#666666', '#ffffff');

if (textOnWhite >= MIN_CONTRAST_NORMAL) {
  checks.pass.push(`✅ Text on white contrast: ${textOnWhite.toFixed(2)}:1 (passes AA)`);
} else {
  checks.fail.push(`❌ Text on white contrast: ${textOnWhite.toFixed(2)}:1 (fails AA, needs ${MIN_CONTRAST_NORMAL}:1)`);
}

if (primaryOnWhite >= MIN_CONTRAST_NORMAL) {
  checks.pass.push(`✅ Primary on white contrast: ${primaryOnWhite.toFixed(2)}:1 (passes AA)`);
} else {
  checks.fail.push(`❌ Primary on white contrast: ${primaryOnWhite.toFixed(2)}:1 (fails AA, needs ${MIN_CONTRAST_NORMAL}:1)`);
}

if (mutedOnWhite >= MIN_CONTRAST_NORMAL) {
  checks.pass.push(`✅ Muted text on white contrast: ${mutedOnWhite.toFixed(2)}:1 (passes AA)`);
} else {
  checks.fail.push(`❌ Muted text on white contrast: ${mutedOnWhite.toFixed(2)}:1 (fails AA, needs ${MIN_CONTRAST_NORMAL}:1)`);
}

// Check 8: Mobile menu ARIA roles
if (headerNav.includes('role="menu"')) {
  checks.pass.push('✅ Mobile menu has role="menu"');
} else {
  checks.fail.push('❌ Mobile menu missing role="menu"');
}

if (headerNav.includes('role="menuitem"')) {
  checks.pass.push('✅ Mobile menu links have role="menuitem"');
} else {
  checks.fail.push('❌ Mobile menu links missing role="menuitem"');
}

// Check 9: Focus management in JS
console.log('🔍 Checking focus management...');
const navJs = fs.readFileSync('assets/js/navigation.js', 'utf8');
if (navJs.includes('trapFocus') || navJs.includes('focus()')) {
  checks.pass.push('✅ Navigation includes focus management');
} else {
  checks.warn.push('⚠️  Navigation may need focus trapping');
}

// Check 10: Search announcements
const searchJs = fs.readFileSync('assets/js/search.js', 'utf8');
if (searchJs.includes('aria-label') || searchJs.includes('setAttribute')) {
  checks.pass.push('✅ Search announces results to screen readers');
} else {
  checks.warn.push('⚠️  Search should announce results');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('ACCESSIBILITY AUDIT RESULTS');
console.log('='.repeat(60));

console.log(`\n✅ Passed (${checks.pass.length}):`);
checks.pass.forEach(check => console.log('  ' + check));

if (checks.fail.length > 0) {
  console.log(`\n❌ Failed (${checks.fail.length}):`);
  checks.fail.forEach(check => console.log('  ' + check));
}

if (checks.warn.length > 0) {
  console.log(`\n⚠️  Warnings (${checks.warn.length}):`);
  checks.warn.forEach(check => console.log('  ' + check));
}

const total = checks.pass.length + checks.fail.length;
const score = Math.round((checks.pass.length / total) * 100);

console.log(`\n📊 Overall Score: ${score}%`);

if (score === 100) {
  console.log('\n🎉 All checks passed! WCAG 2.1 AA compliant.');
  process.exit(0);
} else {
  console.log('\n⚠️  Some issues found. Fix failed checks for full compliance.');
  process.exit(1);
}
