# Claude & Cursor AI Integration SOP

## AI Tools Setup và Configuration

### Claude API Configuration
```python
# Claude API setup cho development workflow
import anthropic
import os

# Environment variables
CLAUDE_API_KEY = os.getenv('CLAUDE_API_KEY')
client = anthropic.Anthropic(api_key=CLAUDE_API_KEY)

# Standard prompt templates
FLUTTER_CONTEXT = """
You are helping with Flutter mobile development using Clean Architecture.
Current tech stack:
- Flutter 3.x with Dart
- State Management: Riverpod
- Local Database: Hive 
- Backend: MySQL on Oracle Cloud
- API: Python FastAPI

Project structure follows feature-first architecture.
"""
```

### Cursor IDE Setup
```json
// .cursor/cursor-settings.json
{
  "flutter.enabled": true,
  "ai.contextLength": 200000,
  "ai.model": "claude-3-sonnet",
  "ai.temperature": 0.1,
  "customRules": [
    "Always use Clean Architecture patterns",
    "Follow Flutter best practices",
    "Include comprehensive error handling",
    "Write tests for all business logic"
  ]
}
```

## AI-Assisted Development Workflow

### 1. Feature Planning với Claude
```bash
# Template prompt cho feature planning
Plan implementation for [feature_name] in Flutter:

Context: [Read from .agent/system/ docs]
Requirements: [Specific requirements]
Constraints: [Technical constraints]

Please provide:
1. Architecture overview
2. File structure
3. Key classes and interfaces  
4. Implementation steps
5. Testing strategy
```

### 2. Code Generation với Cursor
**Best Practices:**
- Use Ctrl+K cho code generation
- Provide clear, specific prompts
- Reference existing patterns
- Always review generated code

## Related Documentation
- Mobile Development Workflow: `sops/mobile_dev_workflow.md`
- Project Architecture: `system/project_architecture.md`
- Flutter Templates: `templates/flutter_feature_template.md`