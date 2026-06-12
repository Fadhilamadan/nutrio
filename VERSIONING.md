# Versioning Guide

This project uses [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for automated versioning and follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## How It Works

commit-and-tag-version will:

- ✅ Determine the next version number based on your commit messages
- ✅ Update `package.json` version
- ✅ Generate/update `CHANGELOG.md`
- ✅ Create a git commit with the changes (e.g. `chore(release): 1.2.3`)
- ✅ Create a git tag for the release

## Commit Message Format

Use these prefixes in your commit messages:

```text
<type>(<scope>): [<ticket>]<subject>

<body>

<footer>
```

### Types and Version Bumps

| Type               | Version Bump | Description             | Example                                                |
| ------------------ | ------------ | ----------------------- | ------------------------------------------------------ |
| `feat:`            | **MINOR**    | New feature             | `feat(auth): [PROJ-001] add OAuth login`               |
| `fix:`             | **PATCH**    | Bug fix                 | `fix(profile): [PROJ-010] resolve avatar upload issue` |
| `perf:`            | **PATCH**    | Performance improvement | `perf(dashboard): [PROJ-500] optimize chart rendering` |
| `BREAKING CHANGE:` | **MAJOR**    | Breaking change         | See below                                              |

Other types (`docs:`, `style:`, `refactor:`, `test:`, `chore:`) appear in changelogs but do not bump the version.

### Examples

**New Feature (MINOR bump):**

```bash
git commit -m "feat(search): [PROJ-050] add filters to search results"
```

**Bug Fix (PATCH bump):**

```bash
git commit -m "fix(detail): [PROJ-100] correct date formatting"
```

**Breaking Change (MAJOR bump):**

```bash
git commit -m "feat!(user): [PROJ-200] redesign user profile API

BREAKING CHANGE: UserProfile now requires 'data' prop instead of individual props"
```

**With Scope:**

```bash
git commit -m "feat(settings): add dark mode toggle"
git commit -m "fix(auth): resolve session expiry handling"
```

## Release Commands

### Automatic Version (Recommended)

Automatically determines version based on commits since last release:

```bash
npx commit-and-tag-version
```

### Manual Version Override

Force a specific version bump:

```bash
npx commit-and-tag-version --release-as patch
npx commit-and-tag-version --release-as minor
npx commit-and-tag-version --release-as major
```

### First Release

For the first release of your project:

```bash
npx commit-and-tag-version --first-release
```

## Workflow Example

### 1. Make Changes and Commit

```bash
# Make changes to your code
git add .
git commit -m "feat: add user favorites feature"
git commit -m "fix: resolve theme toggle persistence"
git commit -m "docs: update README with new features"
```

### 2. Create Release

```bash
npx commit-and-tag-version
```

This will:

1. Analyze commits since last release
2. Determine version bump (e.g. 1.0.0 → 1.1.0 due to 'feat')
3. Update `package.json` version
4. Add entries to `CHANGELOG.md`
5. Create git commit: `chore(release): 1.1.0`
6. Create git tag: `v1.1.0`

### 3. Push to Repository

```bash
git push --follow-tags origin main
```

## Changelog Sections

Commits are grouped in the changelog:

- **Features** - `feat:` commits
- **Bug Fixes** - `fix:` commits
- **Performance Improvements** - `perf:` commits
- **Code Refactoring** - `refactor:` commits
- **Documentation** - `docs:` commits
- **Tests** - `test:` commits
- **Styling** - `style:` commits
- **Chores** - `chore:` commits

## Tips

1. **Be Consistent**: Always use conventional commit format
2. **Be Descriptive**: Write clear commit messages
3. **Commit Often**: Make small, focused commits
4. **Review Before Release**: Check what commits will be included
5. **Test Before Release**: Run tests before creating a release

## Pre-release Versions

For alpha/beta releases:

```bash
npx commit-and-tag-version --prerelease alpha
npx commit-and-tag-version --prerelease beta
```

## Dry Run

Preview what the release will do without making changes:

```bash
npx commit-and-tag-version --dry-run
```

## Configuration

Versioning behavior can be configured in `.versionrc.json` or under the `commit-and-tag-version` key in `package.json`.  
You can customize:

- Commit types and their changelog sections
- Commit message format
- Changelog generation
- Grouped releases

## Troubleshooting

### No commits since last release

```
Error: No commits since last release
```

**Solution**: Make some commits first!

### Wrong version bump

If the automatic version is incorrect, use manual override:

```bash
npx commit-and-tag-version --release-as patch
```

### Undo a release (before pushing)

```bash
git tag -d v1.1.0              # Delete the tag
git reset --hard HEAD~1        # Undo the commit
```

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version)
