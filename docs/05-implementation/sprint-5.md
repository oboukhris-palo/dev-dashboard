# Sprint 5: Future Work / Backlog

**Project Status:** DELIVERED (All 10 stories complete)

---

## Project Completion

The dev-dashboard project is **COMPLETE** as of May 27, 2026.

**Summary:**
- ✅ 4 Epics delivered
- ✅ 10 User stories implemented (28 SP)
- ✅ 89.61% test coverage
- ✅ 0 critical bugs
- ✅ Apache deployment ready

See [user-stories.md](user-stories.md) for implementation details and [sprint-4.md](sprint-4.md) for final sprint metrics.

---

## Backlog: Future Enhancement Opportunities

### High Priority (Future Consideration)

1. **Windows/Linux Auto-Start** (4 SP estimated)
   - Extend auto-start beyond macOS launchd
   - Implement BATCH scripts for Windows (Task Scheduler)
   - Implement systemd service file for Linux

2. **Security Vulnerabilities Patch** (5 SP estimated)
   - Upgrade Angular 18 → 21.2.12 (resolve 8 high-severity CVEs)
   - Review and patch transitive dependencies

3. **Cloud Metadata Sync** (13 SP estimated)
   - Backend API for metadata persistence
   - Sync metadata across multiple devices
   - Authentication layer for cloud access

### Medium Priority

4. **Remote Repository Discovery** (8 SP estimated)
   - Support SSH/HTTPS remote repositories
   - SSH key authentication
   - GitHub/GitLab integration

5. **Repository Search & Filter** (5 SP estimated)
   - Full-text search across repositories
   - Advanced filtering (by language, phase, status)
   - Saved search filters

6. **Batch Operations** (8 SP estimated)
   - Bulk edit metadata for multiple repos
   - Bulk phase/status updates
   - CSV import/export

### Low Priority

7. **Electron/Tauri Desktop App** (20 SP estimated)
   - True desktop application experience
   - Native filesystem access (bypass browser limitations)
   - System tray integration

8. **Metrics & Analytics Dashboard** (8 SP estimated)
   - Project statistics by tech stack
   - Repository activity trends
   - Phase distribution visualization

---

## Known Limitations (Current Release)

1. **macOS Only**: Auto-start configuration uses launchd (macOS-specific)
2. **Local Storage Only**: Metadata stored in localStorage (no cloud sync)
3. **Security Vulnerabilities**: 8 high-severity Angular vulnerabilities (deferred)
4. **Read-Only Remote Repos**: Discovery only for local repositories
5. **No Authentication**: Local use only (no multi-user support)

---

## For Maintenance & Support

- **Apache Logs:** `/usr/local/apache/logs/error_log`
- **WAR Location:** `/usr/local/apache/htdocs/dev-dashboard/app.war`
- **Metadata Storage:** Browser localStorage (key: `dev-dashboard-metadata`)
- **Deployment Scripts:** `src/frontend/scripts/deploy.sh`, `deploy-rollback.sh`

---

**Next Major Release:** TBD (when business case justifies 20+ SP investment)
