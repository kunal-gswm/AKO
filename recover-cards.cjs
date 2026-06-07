const fs = require('fs');
const readline = require('readline');

async function extractProjectCards() {
  const fileStream = fs.createReadStream('C:\\Users\\amvbl\\.gemini\\antigravity-ide\\brain\\79765f1d-033e-4acd-bbfb-5a6f914489e0\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let fileContent = null;

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      if (entry.tool_calls) {
        for (const tc of entry.tool_calls) {
          if (tc.name === 'default_api:write_to_file') {
            const args = tc.arguments;
            if (args.TargetFile && args.TargetFile.endsWith('project-cards.js')) {
              fileContent = args.CodeContent;
            }
          }
        }
      }
    } catch (e) {}
  }

  if (fileContent) {
    fs.writeFileSync('e:\\ako2\\src\\project-cards.js', fileContent, 'utf8');
    console.log('Restored project-cards.js from previous conversation');
  } else {
    console.log('Could not find project-cards.js in previous transcript either');
  }
}

extractProjectCards().catch(console.error);
