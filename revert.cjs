const fs = require('fs');
const readline = require('readline');

async function processTranscript() {
  const fileStream = fs.createReadStream('C:\\Users\\amvbl\\.gemini\\antigravity-ide\\brain\\ce17eab6-61ed-47ad-a7f9-ad32627e1561\\.system_generated\\logs\\transcript.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const fileStates = {};

  for await (const line of rl) {
    if (!line.trim()) continue;
    try {
      const entry = JSON.parse(line);
      
      // Stop processing if we hit the user request that triggered the redesign
      if (entry.type === 'USER_INPUT' && entry.content && entry.content.includes('visuals should dominate')) {
        console.log('Found the redesign prompt. Stopping state tracking.');
        break;
      }

      if (entry.tool_calls) {
        for (const tc of entry.tool_calls) {
          if (tc.name === 'default_api:write_to_file') {
            const args = tc.arguments;
            if (args.TargetFile && args.CodeContent) {
              fileStates[args.TargetFile] = args.CodeContent;
              console.log(`Tracked write_to_file for ${args.TargetFile}`);
            }
          }
          if (tc.name === 'default_api:replace_file_content') {
            const args = tc.arguments;
            if (args.TargetFile && fileStates[args.TargetFile]) {
              // Simple replacement simulation
              const lines = fileStates[args.TargetFile].split('\n');
              const start = args.StartLine - 1;
              const end = args.EndLine;
              const newContentLines = args.ReplacementContent.split('\n');
              lines.splice(start, end - start, ...newContentLines);
              fileStates[args.TargetFile] = lines.join('\n');
              console.log(`Tracked replace_file_content for ${args.TargetFile}`);
            }
          }
          if (tc.name === 'default_api:multi_replace_file_content') {
            const args = tc.arguments;
            if (args.TargetFile && fileStates[args.TargetFile] && args.ReplacementChunks) {
              let lines = fileStates[args.TargetFile].split('\n');
              // Sort chunks by StartLine descending to avoid offset issues
              const chunks = args.ReplacementChunks.sort((a, b) => b.StartLine - a.StartLine);
              for (const chunk of chunks) {
                const start = chunk.StartLine - 1;
                const end = chunk.EndLine;
                const newContentLines = chunk.ReplacementContent.split('\n');
                lines.splice(start, end - start, ...newContentLines);
              }
              fileStates[args.TargetFile] = lines.join('\n');
              console.log(`Tracked multi_replace_file_content for ${args.TargetFile}`);
            }
          }
        }
      }
    } catch (e) {
      console.error('Error parsing line', e);
    }
  }

  // Restore the files
  for (const [filePath, content] of Object.entries(fileStates)) {
    if (filePath.includes('e:\\ako2')) {
      console.log(`Restoring ${filePath}`);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

processTranscript().catch(console.error);
