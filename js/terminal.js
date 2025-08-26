document.addEventListener('DOMContentLoaded', () => {

    // === 1. DOM ELEMENTS ===
    const output = document.getElementById('output');
    const input = document.getElementById('input');
    const prompt = document.getElementById('prompt');
    const themeLink = document.getElementById('theme-link');
    const terminalContainer = document.getElementById('terminal-container');

    // === 2. STATE MANAGEMENT ===
    const commandHistory = [];
    let historyIndex = 0;
    let currentMode = null; 
    let blogMetadataCache = null;

    const AUTOCOMPLETE_COMMANDS = {
        global: ['help', 'helloworld', 'whoami', 'fortune', 'theme', 'about', 'project', 'blog', 'stats', 'clear', 'exit'],
        theme: ['set', 'neon', '--help'],
        about: ['avatar', 'info', 'resume', 'cover-letter', 'contact', 'skills', 'experience', 'education', '--help'],
        project: ['list', 'info', 'open', 'download', '--tech', '--help'],
        blog: ['list', 'open', '--tags', '--search', 'categories', '--help']
    };

    let currentTheme = 'matrix';
    let isNeonOn = true;
    const availableThemes = ['matrix', 'dark', 'light', 'retro'];
    
    const startTime = new Date('Wed Aug 27 2025 02:25:46 GMT+0700')

    // === 3. INITIALIZATION ===
    applyTheme(currentTheme, isNeonOn);
    handleHelloworld();
    input.focus();

    terminalContainer.addEventListener('click', () => { input.focus(); });

    // === 4. MAIN INPUT HANDLER ===
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const commandLine = input.value.trim();
            if (commandLine) {
                const currentPrompt = currentMode ? `[${currentMode}] >>>` : `guest@allaboutme:~$`;
                print(`${currentPrompt} ${commandLine}`);
                commandHistory.push(commandLine);
                historyIndex = commandHistory.length;
                processCommand(commandLine);
            }
            input.value = '';
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleAutocomplete();
        }
    });

    // === 5. COMMAND ROUTER ===
    async function processCommand(commandLine) {
        let originalCommand = commandLine.toLowerCase().split(/\s+/)[0];
        let args = commandLine.toLowerCase().split(/\s+/).slice(1);

        if (currentMode) {
            if (originalCommand === 'quit') {
                exitMode();
                return;
            }
            args.unshift(originalCommand);
            originalCommand = currentMode;
        }

        switch (originalCommand) {
            case 'helloworld': 
                handleHelloworld(1); 
                break;
            
            case 'whoami': 
                handleWhoami(); 
                break;
            
            case 'fortune': 
                await handleFortune(); 
                break;
            
            case 'cowsay': 
                handleCowsay(args); 
                break;
            
            case 'theme': 
                handleTheme(args); 
                break;
            
            case 'help': 
                handleHelp(); 
                break;
            
            case 'about': 
                await handleAbout(args); 
                break;
            
            case 'project': 
                await handleProject(args); 
                break;
            
            case 'blog': 
                await handleBlog(args); 
                break; 
            
            case 'stats': 
                await handleStats(); 
                break; 
            
            case 'clear': 
                handleClear(); 
                break;
            
            case 'exit': 
                handleExit(); 
                break;

            // ===== EASTER EGGS =====
            case 'sudo': handleSudo(args); break;
            case 'date': handleDate(); break;
            case 'uptime': handleUptime(); break;
            case 'pwd': await handlePwd(); break; 
            case 'show-me-your-secret': await handleSecret(args); break; 
            
            default: 
                printError(`Command not found: ${originalCommand}. Type 'help' for a list of commands.`);        
        }

        scrollToBottom();
    }

    // === 6. MODE MANAGEMENT ===
    function enterMode(mode) {
        currentMode = mode;
        prompt.textContent = `[${mode}] >>>`; 
        print(`Entered ${mode} mode. Type 'quit' to exit or '--help' for commands.`);
    }

    function exitMode() {
        print(`Exited ${currentMode} mode.`);
        currentMode = null;
        prompt.textContent = `guest@allaboutme:~$`;
    }
    
    // === 7. COMMAND HANDLERS ===
    async function handleAvatar() {
        const avatarPath = './assets/avatar.png';

        printHTML(`<img src="${avatarPath}" alt="Avatar" class="avatar-image">`);
        printHTML('<span>Do you think I\'m handsome? 😎 (yes/no)</span>');

        const answer = await readInput(); 
        if (answer.toLowerCase() === 'yes') {
            print("Awww :3 I knew it! You're awesome too! 😄");
        } else if (answer.toLowerCase() === 'no') {
            print("Oh no! So Sad... :(");
        } else {
            print("Huh?");
        }
    }

    function handleHelloworld(type) {
        const meme = `
                                        ⢀⣀⣀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠴⠁⠀⠀⠀⠀⠀⠙⠒⢄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡼⡀⠀⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⠮⠤⠤⠤⠤⠤⠤⠤⠤⠠⠤⠤⠥⠦⠀⠀⠀⠀⢀⣼⣆⡴⢋⡼⢃⡴⠋⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠟⣴⣎⡼⠋⣴⠏⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠤⠜⠀⠀⠘⠠⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡼⠛⡼⣻⠟⢠⡿⠃⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣴⠉⠈⠀⠀⠀⠀⠀⠀⠀⠑⢆⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠏⣠⢋⡔⢁⡔⠃⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣼⣾⣷⣟⠱⢏⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⡷⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣿⣿⣿⣿⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⡿⢿⣿⣿⣿⣧⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠁⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⠿⠯⠽⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⣤⠀⢀⣀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢼⣿⡄⠀⢀⣀⣤⣾⣿⣿⣿⣿⣤⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢺⣷⠠⣿⣿⠀⢸⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⣿⣶⣾⣿⣿⣿⣿⣿⣿⣿⡀⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠠⣿⣿⣄⣸⣿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⣿⣿⣿⣿⣿⣿⣿⡿⡏⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⣿⣀⣿⣿⠛⠋⠁⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠻⣿⣿⡿⣿⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠛⢛⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠖⠒⠒⠒⠒⠒⠒⣒⠒⢒⡒⠒⠒⠆⣿⡛⠀⣿⡐⠒⠒⠒⠒⠒⠒⠒⠒⠒⢒⣒⣒⣒⠒⠒⠒⠒⠒⠒⢒⣒⣒⣲⣿⣿⠒⠒⠒⠒⣒⠒⠒⠒⠲
⠀⠀⠀⠀⠀⠁⠉⠈⠈⠉⠀⠀⠈⠉⠉⠁⢀⣀⣀⠉⠁⠀⠉⠁⠀⢀⠈⠉⠉⠉⠁⠀⠀⠀⠉⠈⠉⠀⠦⠤⠀⢀⣀⡀⠀⠀⠘⣿⣿⠀⠈⠉⠉⢉⣀⡄⠀⠀

⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠟⠻⠆⣠⠾⢶⡀⣷⣄⣼⡟⡟⠛⠛⠃⠀⠀⠀⢠⡾⠛⢷⢸⡗⠀⣾⢸⡟⠛⠛⢸⠛⠻⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⠘⠛⡏⣿⠤⢼⡗⣷⠙⢹⡇⡟⠛⠃⠀⠀⠀⠀⢸⡇⠀⢸⠸⣧⢀⡿⢻⡟⠛⠃⢸⠻⣿⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠛⠁⠛⠀⠘⠃⠛⠀⠘⠃⠛⠛⠛⠃⠀⠀⠀⠀⠙⠛⠋⠀⠈⠋⠁⠘⠛⠛⠛⠘⠀⠈⠛⠀⠀⠀⠀⠀⠀⠀⠀⠀

`;
        let welcomeMessage;
        if (!type) welcomeMessage = `
            Welcome to my portfolio!
            Type 'help' to see a list of available commands.`
        else welcomeMessage = `From my DATE of birth to this very UPTIME, how long have I been alive?`
        
        typewriterPrint(`<pre>${meme}</pre>`, 0.5);
        // printHTML(`<pre>${meme}</pre>`);
        print(welcomeMessage);
    }

    function handleWhoami() { 
        print("visitor: A curious human exploring this digital space."); 
        print("If you want to know about you, try the 'pwd' command.");
    }

    async function handleFortune() {
        try {
            const quotes = await fetchData('fortune');
            if(quotes){
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                print(`"${randomQuote}"`);
            }
        } catch (error) {}
    }

    function handleCowsay(args) {
        if (args.length === 0) {
            print("Usage: cowsay <message>");
            return;
        }
        const message = args.join(' ');
        const cow = `
        < ${message} >
         \\   ^__^
          \\  (oo)\\_______
             (__)\\       )\\/\\
                 ||----w |
                 ||     ||
        `;
        printHTML(`<pre>${cow}</pre>`);
        if (message == 's3cr3t') {
            print("Bruh... show-me-your-secret 😉");
        }
    }
    
    function handleTheme(args) {
        const subCommand = args[0];
        const value = args[1];

        if (args.includes('--help') || args.length === 0) {
            const helpData = [
                ['theme set <name>', 'Set terminal theme. Available: matrix, dark, light, retro.'],
                ['theme neon <on|off>', 'Toggle neon glow effect.'],
                ['theme --help', 'Show this help message.']
            ];
            printTable(['Command', 'Description'], helpData);
            return;
        }

        switch (subCommand) {
            case 'set':
                if (value && availableThemes.includes(value)) {
                    applyTheme(value, isNeonOn);
                    print(`Theme set to '${value}'.`);
                } else {
                    printError(`Invalid theme name. Available: ${availableThemes.join(', ')}`);
                }
                break;

            case 'neon':
                if (value === 'on') {
                    applyTheme(currentTheme, true);
                    print('Neon effect enabled.');
                } else if (value === 'off') {
                    applyTheme(currentTheme, false);
                    print('Neon effect disabled.');
                } else {
                    printError("Usage: theme neon <on|off>");
                }
                break;

            default:
                printError(`Unknown subcommand '${subCommand}'. Use 'theme --help'.`);
        }
    }

    function handleClear() { output.innerHTML = ''; }

    function handleExit() {
        print("Closing terminal... Goodbye!");
        setTimeout(() => { window.close(); }, 1000);
    }

    function handleHelp() {
        const helpData = [
            ['helloworld', 'Show welcome message.'],
            ['whoami', 'Display information about you.'],
            ['fortune', 'Show a random inspirational quote.'],
            ['cowsay <message>', 'Make a cow say something. It could be a s3cret!'],
            ['theme', 'Change terminal appearance. Type "theme --help" for options.'],
            ['about', 'Learn more about me. Type "about" or "about --help" for options.'],
            ['project', 'Explore my projects. Type "project" or "project --help" for options.'],
            ['blog', 'Read my blog posts. Type "blog" or "blog --help" for options.'],
            ['clear', 'Clear the terminal screen.'],
            ['exit', 'Exit the terminal.'],
        ];
        printTable(['Command', 'Description'], helpData);
    }

    async function handleAbout(args) {
        if (args.length === 0) {
            enterMode('about');
            return;
        }

        const subCommand = args[0];

        if (subCommand === '--help') {
            const helpData = [
                ['avatar', 'Display my avatar.'],
                ['info', 'Get general information about me.'],
                ['resume', 'Open my resume in a new tab.'],
                ['cover-letter', 'View my cover letter.'],
                ['contact', 'Get my contact details.'],
                ['skills', 'View my technical skills.'],
                ['experience', 'View my work experience.'],
                ['education', 'View my educational background.'],
                ['--help', 'Show this help message.']
            ];
            printTable(['Command', 'Description'], helpData);
            return;
        }

        const profile = await fetchData('profile');
        if (!profile) return;

        switch (subCommand) {
            case 'avatar':
                handleAvatar();
                break;

            case 'info':
                print(profile.info);
                break;

            case 'resume':
                print(`Opening resume...`);
                window.open(profile.resume_path, '_blank');
                break;

            case 'cover-letter': 
                print(`Loading cover-letter.txt...`);
                try {
                    // console.log(profile.cover_letter_path);
                    const response = await fetch(profile.cover_letter_path);
                    if (!response.ok) throw new Error('File not found');
                    const textContent = await response.text();
                    printHTML(`<pre class="file-content">${textContent}</pre>`);
                } catch (error) {
                    printError(`Could not load cover letter: ${error.message}`);
                }
                break;

            case 'contact':
                printSection("CONTACT", profile.contact);
                break;

            case 'skills':
                printSection("TECHNICAL SKILLS", profile.skills);
                break;

            case 'experience':
                printSection("WORK EXPERIENCE", profile.experience);
                break;

            case 'education':
                printSection("EDUCATION", profile.education);
                break;

            default:
                printError(`Unknown subcommand '${subCommand}'. Use 'about --help'.`);
        }
    }

    async function handleProject(args) {
        if (args.length === 0) {
            enterMode('project');
            return;
        }

        const subCommand = args[0];
        const value = args[1];

        if (subCommand === '--help') {
            const helpData = [
                ['list', 'List all projects.'],
                ['info <id>', 'Show detailed info about a project.'],
                ['open <id>', 'Open the project link in a new tab.'],
                ['download <id>', 'Download the project source code.'],
                ['--tech <tech>', 'Filter projects by technology.'],
            ];
            printTable(['Command', 'Description'], helpData);
            return;
        }

        const projects = await fetchData('projects');
        if (!projects) return;

        if (subCommand === 'list') {
            print("Fetching all projects...");
            const tableData = projects.map(p => [p.id, p.title, p.tech.join(', ')]);
            printTable(['ID', 'Title', 'Technologies'], tableData);
            return;
        }

        if (subCommand === '--tech') {
            if (!value) {
                printError("Usage: project --tech <technology>");
                return;
            }
            print(`Filtering projects by technology: ${value}...`);
            const filteredProjects = projects.filter(p => p.tech.includes(value.toLowerCase()));

            if (filteredProjects.length === 0) {
                print(`No projects found with technology: '${value}'.`);
                return;
            }
            const tableData = filteredProjects.map(p => [p.id, p.title, p.tech.join(', ')]);
            printTable(['ID', 'Title', 'Technologies'], tableData);
            return;
        }
        
        const projectId = value;
        if (subCommand == 'list' || subCommand == 'open' || subCommand == 'download' || subCommand == 'info') {
            if (!projectId) {
                printError(`Missing ID. Usage: project ${subCommand} <id>`);
                return;
            }         
        }

        const project = projects.find(p => p.id.toLowerCase() === projectId.toLowerCase());
        if (!project) {
            printError(`Project with ID '${projectId}' not found.`);
            return;
        }

        switch (subCommand) {
            case 'info':
                printHTML(`\n<span class="section-title">PROJECT: ${project.title.toUpperCase()}</span>`);

                const ignoredKeys = ['title'];
                for (const key in project) {
                    if (ignoredKeys.includes(key.toLowerCase())) {
                        continue;
                    }
                    const formattedKey = key
                        .replace(/_/g, ' ') 
                        .replace(/\b\w/g, l => l.toUpperCase()); 
                    
                    let value = project[key];
                    if (Array.isArray(value)) {
                        value = value.join(', ');
                    }
                    
                    const outputLine = `- ${formattedKey.padEnd(14)}: ${value}`;
                    if (typeof value === 'string' && (value.startsWith('http') || value.startsWith('mailto'))) {
                        const linkLine = `- ${formattedKey.padEnd(14)}: <a href="${value}" target="_blank">${value}</a>`;
                        printHTML(linkLine);
                    } else {
                        print(outputLine);
                    }
                }
                
                print('');
                break;

            case 'open':
                print(`Opening project link for '${project.title}'...`);
                window.open(project.url, '_blank');
                break;

            case 'download':
                print(`Starting source code download for '${project.title}'...`);
                window.open(project.download_url, '_blank');
                break;

            default:
                printError(`Unknown subcommand '${subCommand}'. Use 'project --help'.`);
        }
    }

    async function handleBlog(args) {
        if (args.length === 0) {
            enterMode('blog');
            return;
        }
        
        const subCommand = args[0];
        const value = args[1];

        if (subCommand === '--help') {
            const helpData = [
                ['list', 'List all blog posts.'],
                ['open <id>', 'Open a blog post by ID.'],
                ['--tags <tag>', 'Filter posts by tag.'],
                ['--search <query>', 'Search posts by title.'],
                ['categories', 'List all categories.'],
            ];
            printTable(['Command', 'Description'], helpData);
            return;
        }

        const posts = await getAllPostsMetadata();
        if (!posts) return;

        switch (subCommand) {
            case 'list':
                const tableData = posts.map(p => [p.id, p.date, p.title]);
                printTable(['ID', 'Date', 'Title'], tableData);
                break;
            
            case 'open':
                if (!value) { printError("Usage: blog open <id>"); return; }

                const postToOpen = posts.find(p => p.id.toLowerCase() === value.toLowerCase());
                if (!postToOpen) { printError(`Post with ID '${value}' not found.`); return; }
                
                if (typeof marked === 'undefined') {
                    printError("Markdown library (marked.js) not loaded. Please check the file path.");
                    return;
                }

                print(`Loading post: ${postToOpen.title}...`);

                try {
                    const response = await fetch(`./posts/${postToOpen.filename}`);
                    if (!response.ok) throw new Error('File not found');
                    let content = await response.text();
                    content = content.split('---').slice(2).join('---').trim();
                    
                    const htmlContent = marked.parse(content);
                    printHTML(`<div class="blog-post">${htmlContent}</div>`);
                } catch (error) {
                    printError(`Could not load post: ${error.message}`);
                }
                break;

            case '--tags':
                if (!value) { printError("Usage: blog --tags <tag>"); return; }

                const postsByTag = posts.filter(p => p.tags.includes(value.toLowerCase()));
                if (postsByTag.length === 0) { print(`No posts found with tag: '${value}'.`); return; }

                const tagTableData = postsByTag.map(p => [p.id, p.date, p.title]);
                printTable(['ID', 'Date', 'Title'], tagTableData);
                break;
                
            case '--search':
                if (!value) { printError("Usage: blog --search <query>"); return; }

                const query = value.toLowerCase();
                const searchResults = posts.filter(p => p.title.toLowerCase().includes(query));
                if (searchResults.length === 0) { print(`No posts found with query: '${query}'.`); return; }

                const searchTableData = searchResults.map(p => [p.id, p.date, p.title]);
                printTable(['ID', 'Date', 'Title'], searchTableData);
                break;
                
            case 'categories':
                print("Available categories:");
                const categories = [...new Set(posts.map(p => p.category))];
                categories.forEach(cat => print(`- ${cat}`));
                break;

            default:
                printError(`Unknown subcommand '${subCommand}'. Use 'blog --help'.`);
        }
    }

    async function handleStats() {
        print("Fetching GitHub stats...");
        
        const GITHUB_USERNAME = "NgTrongDoanh"; 
        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
            if (!response.ok) throw new Error(`GitHub API returned status ${response.status}`);
            const data = await response.json();

            const contribResponse = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`);
            const contribData = await contribResponse.json();

            let statsOutput = `--- GitHub Stats for ${data.login} ---\n`;
            statsOutput += `- Public Repositories : ${data.public_repos}\n`;
            statsOutput += `- Followers           : ${data.followers}\n`;
            statsOutput += `- Following           : ${data.following}\n`;
            statsOutput += `- Joined GitHub on    : ${new Date(data.created_at).toLocaleDateString()}\n\n`;
            
            statsOutput += `--- Last Year's Contributions ---\n`;
            statsOutput += `Total Contributions: ${contribData.total.lastYear}\n`;
            statsOutput += generateContributionGraph(contribData.contributions); 

            printHTML(`<pre class="stats-container">${statsOutput}</pre>`);

        } catch (error) {
            printError(`Could not fetch GitHub stats: ${error.message}`);
        }
    }

    // === 8. EASTER EGGS HANDLERS ===
    function handleSudo(args) {
        if (args.length === 0) {
            print("sudo: you must specify a command to run.");
            return;
        }

        const command = args[0];
        if (command === 'rm') {
            const hasRfFlag = args.includes('-rf');
            const hasRootPath = args.includes('/');
            const hasNoPreserveRootFlag = args.includes('--no-preserve-root');

            if (hasRfFlag && hasRootPath && !hasNoPreserveRootFlag) {
                print("rm: it is dangerous to operate recursively on '/'");
                print("rm: use --no-preserve-root to override this failsafe");
                return; 
            }

            if (hasRfFlag && hasRootPath && hasNoPreserveRootFlag) {
                print("Permission denied. Just kidding! 😉");
                return; 
            }
        }

        print(`sudo: ${args[0]}: You are not in the sudoers file. This incident will be reported. :)`);
    }

    function handleDate() {
        print(new Date().toString());
    }

    function handleUptime() {
        const now = new Date();
        const uptimeMilliseconds = now - startTime;
        
        const seconds = Math.floor((uptimeMilliseconds / 1000) % 60);
        const minutes = Math.floor((uptimeMilliseconds / (1000 * 60)) % 60);
        const hours = Math.floor((uptimeMilliseconds / (1000 * 60 * 60)) % 24);
        
        print(`Uptime: ${hours}h ${minutes}m ${seconds}s`);
    }

    async function handlePwd() {
        print("Fetching your location...");
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            if (!response.ok) throw new Error('Failed to fetch IP');
            const data = await response.json();
            print(`/home/visitor@${data.ip} 😈 I’m going to save it and catch you.`);
        } catch (error) {
            printError("Could not retrieve your IP address.");
        }
    }

    async function handleSecret(args) {
        const encryptedSecretBase64 = "cldfV0BRRkddWUVZXV5BExFhXkUSVl1HX1wRRFpVEkBUWV0QQVVRQFRMHxB/SRJRQ01CWBJZQQgRdF5GV0t+V2dZX2RARV1cVkU="; 

        printHTML('<span>Enter key to decrypt the secret: </span>');
        const enteredKey = await readInput(true);

        if (enteredKey == "you-are-so-awesome") {
            print(`
        ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣴⠶⠶⢤⣄⣀⣀⣀⣤⡴⠶⠶⠶⠶⠶⣤⣄⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⠀⢀⣀⣼⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠦⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⡾⠛⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⢷⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡒⠿⢧⣤⣀⡀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⢸⡏⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⣤⡀⠀⠉⠛⠲⣦
⠀⠀⠀⠀⠀⠀⠀⢠⣶⣦⣾⣿⣿⠀⠀⠀⠀⠀⣴⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣷⡀⠀⢀⣴⡿
⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⣿⡏⠀⠀⠀⠀⣠⣿⡉⠀⡄⠀⢷⣶⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⢁⣠⡾⠋⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠀⠀⠀⠀⠀⣿⣉⠁⠐⠈⠁⣿⣿⡷⠄⢠⡀⣀⠀⠀⠀⣀⡂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣿⡇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣧⣼⣶⢦⣤⣭⣯⠀⠈⠛⢿⣿⣦⡀⢸⣿⣿⢶⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⠇⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣿⣄⣤⣼⣿⠿⣿⣯⣦⣤⡀⠐⢆⡀⠀⠼⢧⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⣴⣿⡿⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣶⠶⠶⠦⢤⣤⡾⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠛⠶⣧⣦⣖⣀⣛⠋⠰⠀⠀⠀⠀⠀⣠⣿⣿⡿⠁⠀⠀⠀
⠀⢀⣰⣆⠀⠀⠀⠀⠀⣿⡀⣷⣐⣶⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣍⡉⢹⣿⣶⣄⣀⣶⣶⣟⣻⡿⠟⠁⠀⠀⠀⠀
⢀⣿⠋⢿⣆⠀⠀⠀⠀⢿⣇⢹⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣼⡇⢈⠉⠉⠽⢿⣿⡄⠀⠀⠀⠀⠀⠀⠀
⠘⢿⡇⠸⣟⠀⢀⣤⠤⢶⣿⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣷⣾⣧⡀⠀⠈⢿⣷⡄⠀⠀⠀⠀⠀⠀
⠀⠐⠻⣦⣙⣷⠟⠁⠀⣿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣾⠟⠀⣾⣿⠃⠀⠈⠿⣿⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣿⠋⠀⠀⢠⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⠀⠀⠀⠙⢿⡶⠚⠟⠀⠀⠀⡄⠀⠈⠻⣆⠀⠀⠀⠀
⠀⠀⠀⣴⠇⠀⠀⠀⢸⡇⠀⠀⠀⠀⠀⠀⠀⠀⠰⣿⣿⠆⠀⣤⢠⣄⣤⡀⠰⣿⣿⡇⠀⠀⠀⠀⢻⣦⠀⠀⣠⣀⠃⣤⡶⠟⠛⢻⡇⠀⠀
⠀⢀⣴⠟⠀⠀⠀⢀⣼⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠀⠀⠙⠉⠉⠙⠁⠀⠉⠉⠀⠀⠀⠀⠀⢸⣧⣤⣤⣤⡸⠆⢻⣴⣠⣴⠟⠃⠀⠀
⠀⢻⣟⣀⣀⣠⣿⠉⠉⠹⣦⡀⠀⠀⠀⢀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⡾⠋⠉⠉⠉⠻⠶⢾⠟⠋⠀⠀⠀⠀⠀
⠀⠈⠉⠉⠉⠉⠛⠓⠶⠶⠾⠿⠲⠶⣦⣬⣤⣄⣀⣀⣐⣀⣂⣀⣀⣀⣐⣀⣐⣠⣤⣤⣤⠶⠟⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`);
            
            print("Awwww u r so cute too :3 Thank you so much! ❤️");
            return;
        }

        if (enteredKey) {
            try {
                const fromBase64 = atob(encryptedSecretBase64);
                const decryptedMessage = xorEncryptDecrypt(fromBase64, enteredKey);

                print("Decryption result:");
                printHTML(`<div class="file-content">${decryptedMessage}</div>`);
            } catch (error) {
                print(`Decryption result: ${decryptedMessage}"`);
                printHTML(`<div class="file-content">...garbage data (likely incorrect key)...</div>`);
            }
        } else {
            print("Decryption cancelled.");
        }
    }

    function print(message) {
        const line = document.createElement('div');
        line.className = 'output-line';
        line.textContent = message;
        output.appendChild(line);
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function printHTML(html) {
        const line = document.createElement('div');
        line.className = 'output-line';
        line.innerHTML = html;
        output.appendChild(line);
    }

    function printError(message) {
        const line = document.createElement('div');
        line.className = 'output-line error';
        line.textContent = message;
        output.appendChild(line);
    }

    function typewriterPrint(html, speed = 1) {
        const line = document.createElement('div');
        line.className = 'output-line';
        output.appendChild(line);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || "";
        
        let i = 0;        
        const mainInputLine = input.parentElement;
        mainInputLine.style.display = 'none';

        function typing() {
            if (i < textContent.length) {
                line.innerHTML = `<pre>${textContent.substring(0, i + 1)}</pre>`;
                i++;
                scrollToBottom();
                setTimeout(typing, speed);
            } else {
                mainInputLine.style.display = 'flex';
                input.focus();
                scrollToBottom();
            }
        }

        typing();
    }

    async function fetchData(file) {
        try {
            const response = await fetch(`./data/${file}.json`);
            if (!response.ok) throw new Error(`Network response was not ok`);
            return await response.json();
        } catch (error) {
            printError(`Failed to fetch data from ${file}.json.`);
            return null;
        }
    }

    function scrollToBottom() {
        setTimeout(() => { input.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, 0);
    }

    function applyTheme(name, neon) {
        themeLink.setAttribute('href', `./css/themes/${name}.css`);
        currentTheme = name;
        isNeonOn = neon;

        const terminalContainer = document.getElementById('terminal-container');
        if (neon) {
            terminalContainer.classList.add('neon-on');
        } else {
            terminalContainer.classList.remove('neon-on');
        }
    }

    // --- HELPER FUNCTIONS ---
    async function getAllPostsMetadata() {
        if (blogMetadataCache) {
            return blogMetadataCache;
        }
        try {
            print("Fetching blog posts index...");
            const manifestResponse = await fetch('/posts/manifest.json');
            const filenames = await manifestResponse.json();

            const posts = [];
            for (const filename of filenames) {
                const response = await fetch(`./posts/${filename}`);
                const text = await response.text();
                
                const frontmatterMatch = text.match(/---([\s\S]*?)---/);
                if (frontmatterMatch) {
                    const frontmatterText = frontmatterMatch[1];
                    const metadata = {};
                    frontmatterText.trim().split('\n').forEach(line => {
                        const [key, ...valueParts] = line.split(':');
                        let value = valueParts.join(':').trim();
                        if (key.trim() === 'tags') {
                            value = value.replace(/[\[\]"]/g, '').split(',').map(tag => tag.trim());
                        }
                        metadata[key.trim()] = value;
                    });
                    metadata.filename = filename;
                    posts.push(metadata);
                }
            }
            blogMetadataCache = posts.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sắp xếp theo ngày mới nhất
            return blogMetadataCache;
        } catch (error) {
            printError("Could not fetch blog posts.");
            return null;
        }
    }

    function printTable(headers, data) {
        const colWidths = headers.map((header, i) => {
            let maxWidth = header.length;
            for (const row of data) {
                const cell = (i < row.length) ? (row[i] || '') : '';
                if (cell.length > maxWidth) {
                    maxWidth = cell.length;
                }
            }
            return maxWidth;
        });

        const createLine = (left, middle, right) => {
            const parts = colWidths.map(width => '─'.repeat(width + 2));
            return left + parts.join(middle) + right;
        };

        const topBorder = createLine('┌', '┬', '┐');
        const middleBorder = createLine('├', '┼', '┤');
        const bottomBorder = createLine('└', '┴', '┘');
        const headerLine = '│ ' + headers.map((h, i) => h.padEnd(colWidths[i])).join(' │ ') + ' │';

        const dataLines = data.map(row => {
            const cells = colWidths.map((width, i) => {
                const cell = (i < row.length) ? (row[i] || '') : '';
                return cell.padEnd(width);
            });
            return '│ ' + cells.join(' │ ') + ' │';
        });

        let table = topBorder + '\n';
        table += headerLine + '\n';
        table += middleBorder + '\n';
        table += dataLines.join('\n') + '\n';
        table += bottomBorder;

        printHTML(escapeHTML(table));
    }

    function printSection(title, data) {
        printHTML(`\n<span class="section-title">${title}</span>`);

        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                for (const key in item) {
                    const value = item[key];
                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1);

                    if (Array.isArray(value)) {
                        print(`- ${formattedKey}:`);
                        value.forEach(detail => {
                            printHTML(`<span class="item-details">  • ${detail}</span>`);
                        });
                    } else {
                        print(`- ${formattedKey.padEnd(12)}: ${value}`);
                    }
                }
                
                if (index < data.length - 1) {
                    printHTML(`<span class="separator">${'─'.repeat(60)}</span>`);
                }
            });
        } else {
            for (const key in data) {
                let value = data[key];

                if (Array.isArray(value)) {
                    value = value.join(', ');
                }
                
                const isLink = typeof value === 'string' && (value.startsWith('http') || key.toLowerCase() === 'email');
                const href = isLink ? (key.toLowerCase() === 'email' ? `mailto:${value}` : value) : '#';
                const linkTag = isLink ? `<a href="${href}" target="_blank">${value}</a>` : value;
                
                printHTML(`- ${key.padEnd(12)}: ${linkTag}`);
            }
        }
        print(''); 
    }

    function readInput(isPassword = false) {
        printHTML("<span> >>> </span>");
        return new Promise(resolve => {
            const lastOutputLine = output.lastElementChild;
            const mainInputLine = input.parentElement;
            mainInputLine.style.display = 'none';

            const tempInput = document.createElement('input');
            tempInput.type = isPassword ? 'password' : 'text';
            tempInput.className = 'temp-input';
            
            lastOutputLine.appendChild(tempInput);
            tempInput.focus();

            const onEnter = (e) => {
                if (e.key === 'Enter') {
                    const value = tempInput.value;
                    tempInput.removeEventListener('keydown', onEnter);
                    // lastOutputLine.removeChild(tempInput);
                    // if (isPassword) {
                    //     printHTML('•'.repeat(value.length));
                    // } else {
                    //     printHTML(value);
                    // }

                    mainInputLine.style.display = 'flex';
                    input.focus();
                    scrollToBottom();
                    
                    resolve(value);
                }
            };

            tempInput.addEventListener('keydown', onEnter);
        });
    }

    function generateContributionGraph(contributions) {
        const levels = [' ', '░', '▒', '▓', '█'];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const graphMatrix = Array.from({ length: 7 }, () => Array(53).fill(null));
        
        const startDate = new Date(contributions[0].date);
        const startDayOfWeek = startDate.getDay(); // 0=Sun, 1=Mon, ...

        let currentCol = 0;
        contributions.forEach(day => {
            const date = new Date(day.date);
            const dayOfWeek = date.getDay();
            
            graphMatrix[dayOfWeek][currentCol] = day.count;
            
            if (dayOfWeek === 6) {
                currentCol++;
            }
        });

        let output = '';
        const maxContribution = Math.max(...contributions.map(c => c.count));

        let monthLine = ' '.repeat(5); 
        let lastMonth = -1;
        for (let col = 0; col < 53; col++) {
            let monthFound = false;
            for (let row = 0; row < 7; row++) {
                const index = col * 7 + row - startDayOfWeek;
                if (contributions[index]) {
                    const currentMonth = new Date(contributions[index].date).getMonth();
                    if (currentMonth !== lastMonth) {
                        monthLine += months[currentMonth].padEnd(10, ' ');
                        lastMonth = currentMonth;
                        monthFound = true;
                        break;
                    }
                }
            }
            if (!monthFound && col > 0) {
                // Do nothing
            }
        }
        output += monthLine.trimRight() + '\n';

        for (let row = 0; row < 7; row++) {
            let line = '';
            if (row === 1) line += 'Mon '.padEnd(4);
            else if (row === 3) line += 'Wed '.padEnd(4);
            else if (row === 5) line += 'Fri '.padEnd(4);
            else line += '    '; 

            for (let col = 0; col < 53; col++) {
                const count = graphMatrix[row][col];
                if (count === null) {
                    line += '  '; 
                } else {
                    let level = 0;
                    if (count > 0) {
                        level = Math.ceil((count / maxContribution) * 4);
                    }
                    level = Math.max(0, Math.min(level, 4));
                    line += levels[level] + ' ';
                }
            }
            output += line + '\n';
        }
        output += '\n' + ' '.repeat(5) + 'Less ' + levels.slice(1).join(' ') + ' More';

        return output;
    }

    function xorEncryptDecrypt(input, key) {
        let output = '';
        for (let i = 0; i < input.length; i++) {
            const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
            output += String.fromCharCode(charCode);
        }
        return output;
    }

    function handleAutocomplete() {
        const currentText = input.value;
        const parts = currentText.split(' ');
        const lastPart = parts[parts.length - 1]; 

        if (lastPart === '') return; 
        let possibleCommands = [];
        
        if (currentMode) {
            possibleCommands = AUTOCOMPLETE_COMMANDS[currentMode] || [];
        } else {
            if (parts.length === 1) {
                possibleCommands = AUTOCOMPLETE_COMMANDS.global;
            } else {
                const mainCommand = parts[0];
                if (AUTOCOMPLETE_COMMANDS[mainCommand]) {
                    possibleCommands = AUTOCOMPLETE_COMMANDS[mainCommand];
                }
            }
        }

        const matches = possibleCommands.filter(cmd => cmd.startsWith(lastPart));
        if (matches.length === 1) {
            const completedCommand = matches[0];
            parts[parts.length - 1] = completedCommand;
            input.value = parts.join(' ') + ' '; 
        } else if (matches.length > 1) {
            print(matches.join('   ')); 
        }
    }
});