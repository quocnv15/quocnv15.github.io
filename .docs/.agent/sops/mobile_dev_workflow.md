# Mobile Development Workflow SOP

## Daily Development Routine

### Morning Setup (5 phút)
1. **Context Review**
   ```bash
   # Đọc context từ documentation
   cat .agent/readme.md
   ```
2. **Check Current Tasks**
   - Review current feature requirements
   - Check related SOPs và previous implementations
3. **Environment Check**
   - Flutter doctor verification
   - Database connection test
   - AI tools authentication

### Feature Implementation Process

#### 1. Planning Phase (15-20 phút)
```bash
# Sử dụng plan mode trong Claude
/plan implement [feature_name] using Flutter Clean Architecture
```

**Checklist:**
- [ ] Read existing documentation first
- [ ] Define feature requirements clearly  
- [ ] Choose appropriate state management
- [ ] Plan database schema changes
- [ ] Identify API endpoints needed

#### 2. Implementation Phase

**Setup Feature Structure:**
```bash
mkdir -p lib/features/[feature_name]/{data,domain,presentation}
mkdir -p lib/features/[feature_name]/data/{models,repositories,datasources}
mkdir -p lib/features/[feature_name]/domain/{entities,repositories,usecases}
mkdir -p lib/features/[feature_name]/presentation/{pages,widgets,providers}
```

**Development Order:**
1. Domain entities và repository interfaces
2. Data models và repository implementations  
3. Use cases/business logic
4. Presentation layer (providers, pages, widgets)
5. Tests (unit → widget → integration)

## Related Documentation
- Project Architecture: `system/project_architecture.md`
- Flutter Templates: `templates/flutter_feature_template.md`
- Database Schema: `system/database_schema.md`
- API Documentation: `system/api_endpoints.md`