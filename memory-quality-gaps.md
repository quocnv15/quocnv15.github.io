---
layout: page
title: Memory Quality Gaps
permalink: /memory/quality-gaps/
---

## Quality Gaps (Internal Summary)

Các gap dưới đây là vấn đề lặp giữa nhiều app, ảnh hưởng trực tiếp tốc độ scale.

### Cross-app Gaps

- Git history trùng lặp (duplicate commits).
- Versioning chưa chuẩn (repeated `0.0.0`).
- AOA race condition xuất hiện lặp.
- Fork hygiene chưa sạch (remnants, code thừa).

### Priority Order

1. **High:** AOA race condition, release/version discipline.
2. **Medium:** fork cleanup automation, commit hygiene.
3. **Low:** docs consistency và cleanup hậu kỳ.

### Weekly Checklist

- [ ] Chặn release nếu version không hợp lệ.
- [ ] Tạo checklist chống fork remnants trước release.
- [ ] Tách bugfix commit khỏi infra commit khi dev.
- [ ] Theo dõi regressions sau mỗi release.

### Related

- [Memory Hub Summary](/memory/)
- [Memory Portfolio Overview](/memory/portfolio-overview/)
- [Dashboard](/dashboard/)
