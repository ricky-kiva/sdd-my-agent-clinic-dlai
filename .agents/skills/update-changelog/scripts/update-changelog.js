const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getGitCommits() {
  try {
    const raw = execSync('git log --date=short --pretty=format:"%ad|%h|%s"', { encoding: 'utf8' });
    return raw
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [date, hash, ...subjectParts] = line.split('|');
        return {
          date: date.trim(),
          hash: hash.trim(),
          subject: subjectParts.join('|').trim(),
        };
      });
  } catch (err) {
    console.error('Failed to retrieve git log:', err);
    process.exit(1);
  }
}

function generateFullChangelog(commits) {
  const grouped = new Map();

  for (const commit of commits) {
    if (!grouped.has(commit.date)) {
      grouped.set(commit.date, []);
    }
    grouped.get(commit.date).push(commit);
  }

  const lines = ['# Changelog\n', 'All notable changes to AgentClinic are documented in this file.\n'];

  for (const [date, dateCommits] of grouped.entries()) {
    lines.push(`## ${date}\n`);
    for (const c of dateCommits) {
      lines.push(`- ${c.subject} (${c.hash})`);
    }
    lines.push('');
  }

  return lines.join('\n').trim() + '\n';
}

function updateChangelog() {
  const repoRoot = process.cwd();
  const changelogPath = path.join(repoRoot, 'CHANGELOG.md');
  const commits = getGitCommits();

  if (!fs.existsSync(changelogPath)) {
    console.log('No CHANGELOG.md found. Generating from full git history...');
    const content = generateFullChangelog(commits);
    fs.writeFileSync(changelogPath, content, 'utf8');
    console.log(`Generated CHANGELOG.md with ${commits.length} commits.`);
    return;
  }

  console.log('Updating existing CHANGELOG.md with recent commits...');
  const existingContent = fs.readFileSync(changelogPath, 'utf8');

  // Find commits that are not yet recorded in the changelog (by hash)
  const missingCommits = commits.filter(c => !existingContent.includes(`(${c.hash})`));

  if (missingCommits.length === 0) {
    console.log('CHANGELOG.md is already up to date. No new commits found.');
    return;
  }

  console.log(`Found ${missingCommits.length} new commit(s) to add.`);

  // Group missing commits by date
  const missingByDate = new Map();
  for (const commit of missingCommits) {
    if (!missingByDate.has(commit.date)) {
      missingByDate.set(commit.date, []);
    }
    missingByDate.get(commit.date).push(commit);
  }

  // Prepend new date sections after the header
  const headerMatch = existingContent.match(/^(# Changelog[\s\S]*?\n\n)/);
  const header = headerMatch ? headerMatch[1] : '# Changelog\n\n';
  let rest = headerMatch ? existingContent.slice(headerMatch[1].length) : existingContent;

  const newSections = [];
  for (const [date, dateCommits] of missingByDate.entries()) {
    const dateHeader = `## ${date}`;
    if (rest.includes(dateHeader)) {
      // Date section exists, insert bullets under it
      const dateHeaderIdx = rest.indexOf(dateHeader);
      const afterDateHeader = rest.indexOf('\n', dateHeaderIdx) + 1;
      const bullets = dateCommits.map(c => `- ${c.subject} (${c.hash})`).join('\n') + '\n';
      rest = rest.slice(0, afterDateHeader) + bullets + rest.slice(afterDateHeader);
    } else {
      let section = `${dateHeader}\n\n`;
      for (const c of dateCommits) {
        section += `- ${c.subject} (${c.hash})\n`;
      }
      newSections.push(section);
    }
  }

  const updatedContent = header + (newSections.length > 0 ? newSections.join('\n') + '\n' : '') + rest;
  fs.writeFileSync(changelogPath, updatedContent.trim() + '\n', 'utf8');
  console.log('CHANGELOG.md successfully updated.');
}

if (require.main === module) {
  updateChangelog();
}

module.exports = { updateChangelog, getGitCommits, generateFullChangelog };
