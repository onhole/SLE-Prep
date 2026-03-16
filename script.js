const workToAuthor = JSON.parse('{"Sir Gawain and the Green Knight":["Anonymous"],"Troubadour Poetry":["Jaufré Rudel","Bernart De Ventadorn","La Comtessa de Dia"],"Inferno":["Dante Alighieri"],"You Dreamed of Empires":["Enrigue"],"Letters From Mexico":["Hernan Cortez"],"Of Cannibals":["Montaigne"],"The Master\'s Tools Will Never Dismantle the Master\'s House":["Audre Lorde"],"The Prince":["Machiavelli"],"Discourses":["Machiavelli"],"Renaissance Poetry":["Jacopo da Lentini","Dante Alighieri","Francesco Petrarca","Pietro Bembo","Gaspara Stampa","Michelangelo Buonarroti","Louise Labé","Edmund Spencer","William Shakespeare"],"The Tempest":["William Shakespeare"],"Royal Commentaries of the Incas":["Inca Garcilaso de la Vega"],"Don Quixote":["Cervantes"],"Meditations on First Philosophy":["René Descartes"],"Second Treatise on Government":["John Locke"],"Notes on the State of Virginia":["Thomas Jefferson"],"What is Enlightenment?":["Immanuel Kant"],"Discourse on Inequality":["Rosseau"],"Zong!":["M. NourbeSe Philip"],"Frankenstein":["Mary Shelly"],"On the Essence of Religion":["Schleiermacher"],"Auguries of Innocence":["Blake"],"The Book of Thel":["Blake"],"The Marriage of Heaven and Hell":["Blake"],"The Garden of Love":["Blake"],"A Poison Tree":["Blake"],"Letter to Dr. Tustler":["Blake"],"Preface to Lyrical Ballads":["William Wordsworth"],"Nutting":["William Wordsworth"],"Ode: Immitations of Immortality from Recollections of Early Childhood":["William Wordsworth"],"We Are Seven":["William Wordsworth"]}');

const authorToWork = JSON.parse('{"Anonymous":["Sir Gawain and the Green Knight"],"Jaufré Rudel":["Troubadour Poetry"],"Bernart De Ventadorn":["Troubadour Poetry"],"La Comtessa de Dia":["Troubadour Poetry"],"Dante":["Inferno", "Renaissance Poetry"],"Enrigue":["You Dreamed of Empires"],"Hernan Cortez":["Letters From Mexico"],"Montaigne":["Of Cannibals"],"Audre Lorde":["The Master\'s Tools Will Never Dismantle the Master\'s House"],"Machiavelli":["The Prince","Discourses"],"Jacopo da Lentini":["Renaissance Poetry"],"Francesco Petrarca":["Renaissance Poetry"],"Pietro Bembo":["Renaissance Poetry"],"Gaspara Stampa":["Renaissance Poetry"],"Michelangelo Buonarroti":["Renaissance Poetry"],"Louise Labé":["Renaissance Poetry"],"Edmund Spencer":["Renaissance Poetry"],"William Shakespeare":["Renaissance Poetry","The Tempest"],"Inca Garcilaso de la Vega":["Royal Commentaries of the Incas"],"Cervantes":["Don Quixote"],"René Descartes":["Meditations on First Philosophy"],"John Locke":["Second Treatise on Government"],"Thomas Jefferson":["Notes on the State of Virginia"],"Immanuel Kant":["What is Enlightenment?"],"Rosseau":["Discourse on Inequality"],"M. NourbeSe Philip":["Zong!"],"Mary Shelly":["Frankenstein"],"Schleiermacher":["On the Essence of Religion"],"Blake":["Auguries of Innocence","The Book of Thel","The Marriage of Heaven and Hell","The Garden of Love","A Poison Tree","Letter to Dr. Tustler "],"William Wordsworth":["Preface to Lyrical Ballads","Nutting","Ode: Immitations of Immortality from Recollections of Early Childhood","We Are Seven"]}');

// Supabase leaderboard client
const supabaseUrl = 'https://chndgufgfsjoohljkjet.supabase.co';
// TODO: replace with your Supabase anon public key from Settings → API
const supabaseAnonKey = 'sb_publishable_5h6ZpVN4k0_vOyfIQ5XRNw_ssY5m-tt';
const supabaseClient = (typeof supabase !== "undefined" && supabaseUrl && supabaseAnonKey)
    ? supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;

let currentType = "none";
let currentThing = "";
const questionElement = document.getElementById("question");
const answerInput = document.getElementById("answer");
const feedbackElement = document.getElementById("feedback");
const progressTrackerElement = document.getElementById("progress-tracker");
const progressLabelElement = document.getElementById("progress-label");
const progressListElement = document.getElementById("progress-list");
const firstTryScoreElement = document.getElementById("first-try-score");
const totalCorrectElement = document.getElementById("total-correct");
const questionsRemainingElement = document.getElementById("questions-remaining");
const elapsedTimeElement = document.getElementById("elapsed-time");
const roundSummaryModalElement = document.getElementById("round-summary-modal");
const summaryRoundFirstTryElement = document.getElementById("summary-round-first-try");
const summaryRoundCorrectElement = document.getElementById("summary-round-correct");
const summaryRoundRateElement = document.getElementById("summary-round-rate");
const summaryRoundTimeElement = document.getElementById("summary-round-time");
const summarySessionFirstTryElement = document.getElementById("summary-session-first-try");
const summarySessionCorrectElement = document.getElementById("summary-session-correct");
const summarySessionTimeElement = document.getElementById("summary-session-time");
const summaryMissedListElement = document.getElementById("summary-missed-list");
const summaryShareTextElement = document.getElementById("summary-share-text");
const hardModeToggle = document.getElementById("hard-mode-toggle");
const modeBadgeElement = document.getElementById("mode-badge");
const copyShareButton = document.getElementById("copy-share-btn");
const copyShareStatusElement = document.getElementById("copy-share-status");
const nextRoundButton = document.getElementById("next-round-btn");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");
const endRoundButton = document.getElementById("end-round-btn");
const playerNameInput = document.getElementById("player-name");
const introLeaderboardButton = document.getElementById("intro-leaderboard-btn");
const inroundLeaderboardButton = document.getElementById("inround-leaderboard-btn");
const leaderboardModalElement = document.getElementById("leaderboard-modal");
const leaderboardNormalButton = document.getElementById("leaderboard-normal-btn");
const leaderboardHardButton = document.getElementById("leaderboard-hard-btn");
const leaderboardCloseButton = document.getElementById("leaderboard-close-btn");
const leaderboardStatusElement = document.getElementById("leaderboard-status");
const leaderboardBodyElement = document.getElementById("leaderboard-body");
const leaderboardMeTextElement = document.getElementById("leaderboard-me-text");
const leaderboardAboveTextElement = document.getElementById("leaderboard-above-text");
let autoAdvanceTimeoutId = null;
let timerIntervalId = null;
let timerStartTimestamp = 0;
let roundStartTimestamp = 0;
const usedAuthorsByWork = new Map();
const usedWorksByAuthor = new Map();
const remainingAuthorPrompts = new Map();
const remainingWorkPrompts = new Map();
const HARD_MODE_WORKS = new Set(["Troubadour Poetry", "Renaissance Poetry"]);
let currentQuestionIsFirstTry = true;
let currentQuestionPromptText = "";
let firstTryScore = 0;
let totalCorrect = 0;
let questionsRemaining = 0;
let questionsPerRound = 0;
let roundStartFirstTryScore = 0;
let roundStartTotalCorrect = 0;
let awaitingRoundRestart = false;
let hardModeEnabled = false;
let activeWorkToAuthor = workToAuthor;
let activeAuthorToWork = authorToWork;
const missedFirstTryByPromptInRound = new Map();
let currentPlayerName = "";
let currentLeaderboardMode = "normal";

function getCurrentModeKey() {
    return hardModeEnabled ? "hard" : "normal";
}

function buildActiveQuizData() {
    if (!hardModeEnabled) {
        activeWorkToAuthor = workToAuthor;
        activeAuthorToWork = authorToWork;
        return;
    }

    const filteredWorkEntries = Object.entries(workToAuthor)
        .filter(function([work]) {
            return HARD_MODE_WORKS.has(work);
        });

    activeWorkToAuthor = Object.fromEntries(filteredWorkEntries);
    const allowedWorks = new Set(Object.keys(activeWorkToAuthor));
    const filteredAuthorEntries = Object.entries(authorToWork)
        .map(function([author, works]) {
            return [author, works.filter(function(work) {
                return allowedWorks.has(work);
            })];
        })
        .filter(function([, works]) {
            return works.length > 0;
        });

    activeAuthorToWork = Object.fromEntries(filteredAuthorEntries);
}

function updateModeBadge() {
    modeBadgeElement.textContent = hardModeEnabled
        ? "Hard Mode: Troubadour + Renaissance"
        : "Standard Mode";
}

function clearAutoAdvanceTimer() {
    if (autoAdvanceTimeoutId !== null) {
        clearTimeout(autoAdvanceTimeoutId);
        autoAdvanceTimeoutId = null;
    }
}

function scheduleNextQuestion() {
    clearAutoAdvanceTimer();
    autoAdvanceTimeoutId = setTimeout(function() {
        setQuestion();
        answerInput.value = "";
        answerInput.focus();
        autoAdvanceTimeoutId = null;
    }, 1000);
}

function randomIndex(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
}

function initializeRoundPool() {
    buildActiveQuizData();
    remainingAuthorPrompts.clear();
    remainingWorkPrompts.clear();

    Object.entries(activeWorkToAuthor).forEach(function([work, authors]) {
        remainingAuthorPrompts.set(work, authors.length);
    });

    Object.entries(activeAuthorToWork).forEach(function([author, works]) {
        remainingWorkPrompts.set(author, works.length);
    });

    usedAuthorsByWork.clear();
    usedWorksByAuthor.clear();
    questionsRemaining = [...remainingAuthorPrompts.values()].reduce((sum, count) => sum + count, 0)
        + [...remainingWorkPrompts.values()].reduce((sum, count) => sum + count, 0);
    questionsPerRound = questionsRemaining;
}

function getAvailableKeysWithRemaining(store) {
    return [...store.entries()]
        .filter(([, remaining]) => remaining > 0)
        .map(([key]) => key);
}

function choosePromptFromPool() {
    const authorKeys = getAvailableKeysWithRemaining(remainingAuthorPrompts);
    const workKeys = getAvailableKeysWithRemaining(remainingWorkPrompts);

    if (!authorKeys.length && !workKeys.length) {
        return null;
    }

    const askForAuthor = authorKeys.length && workKeys.length
        ? Math.random() < 0.5
        : authorKeys.length > 0;

    if (askForAuthor) {
        const randomWork = authorKeys[randomIndex(authorKeys.length)];
        remainingAuthorPrompts.set(randomWork, remainingAuthorPrompts.get(randomWork) - 1);
        return { type: "author", thing: randomWork };
    }

    const randomAuthor = workKeys[randomIndex(workKeys.length)];
    remainingWorkPrompts.set(randomAuthor, remainingWorkPrompts.get(randomAuthor) - 1);
    return { type: "work", thing: randomAuthor };
}

function formatElapsedTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function addMissedFirstTryQuestion(promptText, options) {
    if (!missedFirstTryByPromptInRound.has(promptText)) {
        missedFirstTryByPromptInRound.set(promptText, { count: 1, options: [...options] });
        return;
    }

    const existing = missedFirstTryByPromptInRound.get(promptText);
    existing.count += 1;
}

function buildShareSummary(roundFirstTry, roundCorrect, roundRate, roundTime, sessionTime) {
    const reviewLines = [...missedFirstTryByPromptInRound.entries()].map(function([promptText, detail]) {
        const suffix = detail.count > 1 ? ` (${detail.count}x)` : "";
        return `- ${promptText}${suffix}`;
    });

    const reviewBlock = reviewLines.length
        ? reviewLines.join("\n")
        : "- None. Perfect first-try round.";

    return [
        "SLE Prep Score Summary",
        "",
        `Round first-try: ${roundFirstTry}/${questionsPerRound}`,
        `Round correct: ${roundCorrect}/${questionsPerRound}`,
        `Round first-try rate: ${roundRate}`,
        `Round time: ${roundTime}`,
        "",
        `Session first-try: ${firstTryScore}`,
        `Session correct: ${totalCorrect}`,
        `Session time: ${sessionTime}`,
        "",
        "Questions missed on first try:",
        reviewBlock
    ].join("\n");
}

function renderMissedFirstTryReview() {
    summaryMissedListElement.innerHTML = "";

    if (!missedFirstTryByPromptInRound.size) {
        const li = document.createElement("li");
        li.textContent = "Perfect first-try round. No review items.";
        summaryMissedListElement.appendChild(li);
        return;
    }

    [...missedFirstTryByPromptInRound.entries()].forEach(function([promptText, detail]) {
        const li = document.createElement("li");
        const suffix = detail.count > 1 ? ` (${detail.count}x)` : "";
        li.textContent = `${promptText}${suffix} | Valid answers: ${detail.options.join(", ")}`;
        summaryMissedListElement.appendChild(li);
    });
}

function showRoundSummaryModal() {
    const roundFirstTry = firstTryScore - roundStartFirstTryScore;
    const roundCorrect = totalCorrect - roundStartTotalCorrect;
    const roundRate = questionsPerRound > 0
        ? `${Math.round((roundFirstTry / questionsPerRound) * 100)}%`
        : "0%";
    const roundElapsedSeconds = Math.floor((Date.now() - roundStartTimestamp) / 1000);
    const sessionElapsedSeconds = Math.floor((Date.now() - timerStartTimestamp) / 1000);
    const roundTime = formatElapsedTime(roundElapsedSeconds);
    const sessionTime = formatElapsedTime(sessionElapsedSeconds);

    submitRoundScore(roundFirstTry);

    summaryRoundFirstTryElement.textContent = `${roundFirstTry}/${questionsPerRound}`;
    summaryRoundCorrectElement.textContent = `${roundCorrect}/${questionsPerRound}`;
    summaryRoundRateElement.textContent = roundRate;
    summaryRoundTimeElement.textContent = roundTime;
    summarySessionFirstTryElement.textContent = String(firstTryScore);
    summarySessionCorrectElement.textContent = String(totalCorrect);
    summarySessionTimeElement.textContent = sessionTime;

    renderMissedFirstTryReview();
    summaryShareTextElement.value = buildShareSummary(roundFirstTry, roundCorrect, roundRate, roundTime, sessionTime);
    copyShareStatusElement.textContent = "";
    roundSummaryModalElement.classList.remove("hidden");
}

async function submitRoundScore(pointsGained) {
    if (!supabaseClient) {
        return;
    }
    const trimmedName = (currentPlayerName || "").trim();
    if (!trimmedName || pointsGained <= 0) {
        return;
    }

    const modeKey = getCurrentModeKey(); // "normal" or "hard"
    const isHard = modeKey === "hard";
    const pointsColumn = isHard ? "hard_point" : "normal_point";

    const { data, error } = await supabaseClient
        .from("scores")
        .select(`name, ${pointsColumn}`)
        .eq("name", trimmedName)
        .maybeSingle();

    if (error && error.code !== "PGRST116") {
        console.error("Error fetching current score", error);
        return;
    }

    const existing = data || null;

    if (!existing) {
        const insertPayload = {
            name: trimmedName,
            mode: modeKey,
            hard_point: isHard ? pointsGained : 0,
            normal_point: isHard ? 0 : pointsGained,
            updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabaseClient
            .from("scores")
            .insert(insertPayload);

        if (insertError) {
            console.error("Error inserting score", insertError);
        }
        return;
    }

    const currentPoints = Number(existing[pointsColumn] || 0);
    const newTotal = currentPoints + pointsGained;

    const updatePayload = {
        [pointsColumn]: newTotal,
        mode: modeKey,
        updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabaseClient
        .from("scores")
        .update(updatePayload)
        .eq("name", trimmedName);

    if (updateError) {
        console.error("Error updating score", updateError);
    }
}

function setLeaderboardMode(modeKey) {
    currentLeaderboardMode = modeKey;
    if (leaderboardNormalButton && leaderboardHardButton) {
        leaderboardNormalButton.classList.toggle("active", modeKey === "normal");
        leaderboardHardButton.classList.toggle("active", modeKey === "hard");
        leaderboardNormalButton.setAttribute("aria-selected", modeKey === "normal" ? "true" : "false");
        leaderboardHardButton.setAttribute("aria-selected", modeKey === "hard" ? "true" : "false");
    }
}

function computeLeaderboardPositions(entries, playerName) {
    const withRanks = entries.map((row, index) => ({
        ...row,
        rank: index + 1
    }));

    const lowerName = (playerName || "").trim().toLowerCase();
    const meIndex = lowerName
        ? withRanks.findIndex(row => row.name.trim().toLowerCase() === lowerName)
        : -1;

    if (meIndex === -1) {
        return { rows: withRanks, me: null, above: null };
    }

    const me = withRanks[meIndex];
    const above = meIndex > 0 ? withRanks[meIndex - 1] : null;
    return { rows: withRanks, me, above };
}

async function loadLeaderboard() {
    if (!supabaseClient) {
        if (leaderboardStatusElement) {
            leaderboardStatusElement.textContent = "Leaderboard is not configured.";
        }
        return;
    }

    if (leaderboardStatusElement) {
        leaderboardStatusElement.textContent = "Loading…";
    }
    if (leaderboardBodyElement) {
        leaderboardBodyElement.innerHTML = "";
    }
    if (leaderboardMeTextElement) {
        leaderboardMeTextElement.textContent = "";
    }
    if (leaderboardAboveTextElement) {
        leaderboardAboveTextElement.textContent = "";
    }

    const pointsColumn = currentLeaderboardMode === "hard" ? "hard_point" : "normal_point";

    const { data, error } = await supabaseClient
        .from("scores")
        .select(`name, mode, points:${pointsColumn}`)
        .order(pointsColumn, { ascending: false })
        .limit(50);

    if (error) {
        console.error("Error loading leaderboard", error);
        if (leaderboardStatusElement) {
            leaderboardStatusElement.textContent = "Could not load leaderboard.";
        }
        return;
    }

    const trimmedName = (currentPlayerName || "").trim();
    const { rows, me, above } = computeLeaderboardPositions(data || [], trimmedName);

    if (leaderboardBodyElement) {
        rows.forEach(function(row) {
            const tr = document.createElement("tr");
            if (rows.length && rows[0] === row) {
                tr.classList.add("leaderboard-row-top");
            }
            if (me && row.name === me.name && row.mode === me.mode) {
                tr.classList.add("leaderboard-row-me");
            }

            const rankTd = document.createElement("td");
            rankTd.textContent = String(row.rank);
            const nameTd = document.createElement("td");
            nameTd.textContent = row.name;
            const ptsTd = document.createElement("td");
            ptsTd.textContent = String(row.points);

            tr.appendChild(rankTd);
            tr.appendChild(nameTd);
            tr.appendChild(ptsTd);
            leaderboardBodyElement.appendChild(tr);
        });
    }

    if (leaderboardStatusElement) {
        if (!rows.length) {
            leaderboardStatusElement.textContent = "No scores yet. Be the first to set a record.";
        } else {
            leaderboardStatusElement.textContent = "";
        }
    }

    if (leaderboardMeTextElement) {
        if (me) {
            if (me.rank === 1) {
                leaderboardMeTextElement.textContent = `You are currently #1 with ${me.points} point${me.points === 1 ? "" : "s"} 👑`;
            } else {
                leaderboardMeTextElement.textContent = `You are currently #${me.rank} with ${me.points} point${me.points === 1 ? "" : "s"}.`;
            }
        } else if (trimmedName) {
            leaderboardMeTextElement.textContent = `You do not have a recorded score yet in ${currentLeaderboardMode} mode. Finish a round to join the board.`;
        } else {
            leaderboardMeTextElement.textContent = "";
        }
    }

    if (leaderboardAboveTextElement) {
        if (me && above) {
            leaderboardAboveTextElement.textContent = `Next to beat: ${above.name} with ${above.points} point${above.points === 1 ? "" : "s"}.`;
        } else if (me && !above && rows.length) {
            leaderboardAboveTextElement.textContent = "You are at the top of the board. Keep it up!";
        } else {
            leaderboardAboveTextElement.textContent = "";
        }
    }
}

function hideRoundSummaryModal() {
    roundSummaryModalElement.classList.add("hidden");
}

function startNextRound() {
    hideRoundSummaryModal();
    awaitingRoundRestart = false;
    initializeRoundPool();
    roundStartTimestamp = Date.now();
    roundStartFirstTryScore = firstTryScore;
    roundStartTotalCorrect = totalCorrect;
    missedFirstTryByPromptInRound.clear();
    updateScoreboard();
    setQuestion();
    answerInput.value = "";
    answerInput.focus();
}

function copyShareSummaryText() {
    summaryShareTextElement.focus();
    summaryShareTextElement.select();
    let copied = false;

    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        navigator.clipboard.writeText(summaryShareTextElement.value)
            .then(function() {
                copyShareStatusElement.textContent = "Copied to clipboard.";
            })
            .catch(function() {
                const fallbackSuccess = document.execCommand("copy");
                copyShareStatusElement.textContent = fallbackSuccess
                    ? "Copied to clipboard."
                    : "Could not copy automatically. Copy manually from the text box.";
            });
        return;
    }

    copied = document.execCommand("copy");
    copyShareStatusElement.textContent = copied
        ? "Copied to clipboard."
        : "Could not copy automatically. Copy manually from the text box.";
}

function updateElapsedTimeDisplay() {
    const elapsedSeconds = Math.floor((Date.now() - timerStartTimestamp) / 1000);
    elapsedTimeElement.textContent = formatElapsedTime(elapsedSeconds);
}

function startElapsedTimer() {
    if (timerIntervalId !== null) {
        clearInterval(timerIntervalId);
    }
    timerStartTimestamp = Date.now();
    updateElapsedTimeDisplay();
    timerIntervalId = setInterval(updateElapsedTimeDisplay, 1000);
}

function updateScoreboard() {
    firstTryScoreElement.textContent = String(firstTryScore);
    totalCorrectElement.textContent = String(totalCorrect);
    questionsRemainingElement.textContent = String(questionsRemaining);
}

function normalizeAnswer(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

function showFeedback(message, isCorrect) {
    feedbackElement.textContent = message;
    feedbackElement.className = `feedback show ${isCorrect ? "correct" : "incorrect"}`;
}

function getOrCreateUsedSet(store, key) {
    if (!store.has(key)) {
        store.set(key, new Set());
    }
    return store.get(key);
}

function getCurrentOptions() {
    if (currentType === "author") {
        return (activeWorkToAuthor[currentThing] || []).map(author => author.trim());
    }

    if (currentType === "work") {
        return (activeAuthorToWork[currentThing] || []).map(work => work.trim());
    }

    return [];
}

function updateProgressTracker() {
    const options = getCurrentOptions();
    let used = [];
    let label = "Progress Tracker";

    if (currentType === "author") {
        used = [...getOrCreateUsedSet(usedAuthorsByWork, currentThing)];
        label = `Authors listed for "${currentThing}" (${used.length}/${options.length})`;
    } else if (currentType === "work") {
        used = [...getOrCreateUsedSet(usedWorksByAuthor, currentThing)];
        label = `Works listed for ${currentThing} (${used.length}/${options.length})`;
    }

    if (options.length <= 1) {
        progressTrackerElement.hidden = true;
        return;
    }

    progressTrackerElement.hidden = false;
    progressTrackerElement.className = "progress-tracker active";
    progressLabelElement.textContent = label;
    progressListElement.textContent = used.length ? used.join(", ") : "None yet.";
}

function setQuestion() {
    clearAutoAdvanceTimer();
    feedbackElement.className = "feedback";
    feedbackElement.textContent = "";

    if (awaitingRoundRestart) {
        return;
    }

    if (questionsRemaining <= 0) {
        awaitingRoundRestart = true;
        showRoundSummaryModal();
        return;
    }

    const nextPrompt = choosePromptFromPool();
    if (!nextPrompt) {
        return;
    }

    currentQuestionIsFirstTry = true;
    currentType = nextPrompt.type;
    currentThing = nextPrompt.thing;
    questionsRemaining -= 1;

    if (currentType === "author") {
        if (activeWorkToAuthor[currentThing].length > 1) {
            currentQuestionPromptText = `Name an author of "${currentThing}".`;
        } else {
            currentQuestionPromptText = `Who is the author of "${currentThing}"?`;
        }
    } else {
        if (activeAuthorToWork[currentThing].length > 1) {
            currentQuestionPromptText = `Name a work by ${currentThing}.`;
        } else {
            currentQuestionPromptText = `What did ${currentThing} write?`;
        }
    }

    questionElement.textContent = currentQuestionPromptText;

    updateProgressTracker();
    updateScoreboard();
}

function checkAnswer() {
    const userAnswer = normalizeAnswer(answerInput.value);

    if (!userAnswer) {
        showFeedback("Type an answer first.", false);
        return;
    }

    if (currentType === "author") {
        const authorOptions = getCurrentOptions();
        const normalizedAuthors = authorOptions.map(author => normalizeAnswer(author));
        const authorLastNames = normalizedAuthors.map(author => author.split(" ").at(-1));
        const usedAuthors = getOrCreateUsedSet(usedAuthorsByWork, currentThing);

        if (usedAuthors.size >= authorOptions.length) {
            usedAuthors.clear();
        }

        updateProgressTracker();

        const matchedAuthorIndex = normalizedAuthors.findIndex((author, index) => {
            return userAnswer === author || userAnswer === authorLastNames[index];
        });

        if (matchedAuthorIndex === -1) {
            clearAutoAdvanceTimer();
            currentQuestionIsFirstTry = false;
            if (authorOptions.length > 1) {
                showFeedback(`Not quite. Possible answers: ${activeWorkToAuthor[currentThing].join(", ")}`, false);
            }
            else {
                showFeedback(`Not quite. Correct answer: ${activeWorkToAuthor[currentThing][0]}`, false);
            }
        } else {
            const matchedAuthor = authorOptions[matchedAuthorIndex];

            if (usedAuthors.has(matchedAuthor)) {
                clearAutoAdvanceTimer();
                currentQuestionIsFirstTry = false;
                const alreadyNamedList = [...usedAuthors].join(", ");
                showFeedback(`You already named ${matchedAuthor} for "${currentThing}". Name someone new. Already named: ${alreadyNamedList}.`, false);
                updateProgressTracker();
            } else {
                usedAuthors.add(matchedAuthor);
                if (!currentQuestionIsFirstTry) {
                    addMissedFirstTryQuestion(currentQuestionPromptText, authorOptions);
                }
                totalCorrect += 1;
                if (currentQuestionIsFirstTry) {
                    firstTryScore += 1;
                }
                updateProgressTracker();
                updateScoreboard();
                if (usedAuthors.size === authorOptions.length && authorOptions.length > 1) {
                    showFeedback("Correct. Nice work. You completed all possible authors for this work; progress resets next time.", true);
                } else {
                    showFeedback("Correct. Nice work.", true);
                }
                scheduleNextQuestion();
            }
        }
    }
    else if (currentType === "work") {
        const workOptions = getCurrentOptions();
        const normalizedWorks = workOptions.map(work => normalizeAnswer(work));
        const usedWorks = getOrCreateUsedSet(usedWorksByAuthor, currentThing);

        if (usedWorks.size >= workOptions.length) {
            usedWorks.clear();
        }

        updateProgressTracker();

        const matchedWorkIndex = normalizedWorks.findIndex(work => userAnswer === work);

        if (matchedWorkIndex === -1) {
            clearAutoAdvanceTimer();
            currentQuestionIsFirstTry = false;
            if (workOptions.length > 1) {
                showFeedback(`Not quite. Possible answers: ${activeAuthorToWork[currentThing].join(", ")}`, false);
            }
            else {
                showFeedback(`Not quite. Correct answer: ${activeAuthorToWork[currentThing][0]}`, false);
            }
        } else {
            const matchedWork = workOptions[matchedWorkIndex];

            if (usedWorks.has(matchedWork)) {
                clearAutoAdvanceTimer();
                currentQuestionIsFirstTry = false;
                const alreadyNamedList = [...usedWorks].join(", ");
                showFeedback(`You already named "${matchedWork}" for ${currentThing}. Name a new work. Already named: ${alreadyNamedList}.`, false);
                updateProgressTracker();
            } else {
                usedWorks.add(matchedWork);
                if (!currentQuestionIsFirstTry) {
                    addMissedFirstTryQuestion(currentQuestionPromptText, workOptions);
                }
                totalCorrect += 1;
                if (currentQuestionIsFirstTry) {
                    firstTryScore += 1;
                }
                updateProgressTracker();
                updateScoreboard();
                if (usedWorks.size === workOptions.length && workOptions.length > 1) {
                    showFeedback("Correct. Nice work. You completed all works for this author; progress resets next time.", true);
                } else {
                    showFeedback("Correct. Nice work.", true);
                }
                scheduleNextQuestion();
            }
        }
    }

    // Clear the input field for the next question
    answerInput.value = "";
    answerInput.focus();
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        checkAnswer();
    }
});

submitButton.addEventListener("click", checkAnswer);
nextButton.addEventListener("click", function() {
    answerInput.value = "";
    setQuestion();
    answerInput.focus();
});

if (endRoundButton) {
    endRoundButton.addEventListener("click", function() {
        if (awaitingRoundRestart) {
            return;
        }
        questionsRemaining = 0;
        setQuestion();
    });
}

copyShareButton.addEventListener("click", copyShareSummaryText);
nextRoundButton.addEventListener("click", startNextRound);

document.getElementById("begin-btn").addEventListener("click", function() {
    const rawName = playerNameInput ? playerNameInput.value : "";
    currentPlayerName = rawName.trim();
    if (!currentPlayerName) {
        if (feedbackElement) {
            feedbackElement.textContent = "Please enter a name to begin.";
            feedbackElement.className = "feedback show incorrect";
        }
        if (playerNameInput) {
            playerNameInput.focus();
        }
        return;
    }

    try {
        window.localStorage.setItem("sle-prep-name", currentPlayerName);
    } catch (_) {
        // ignore
    }

    hardModeEnabled = Boolean(hardModeToggle && hardModeToggle.checked);
    updateModeBadge();
    document.getElementById("intro-screen").hidden = true;
    document.querySelector(".page-shell").hidden = false;
    initializeRoundPool();
    startElapsedTimer();
    roundStartTimestamp = Date.now();
    roundStartFirstTryScore = firstTryScore;
    roundStartTotalCorrect = totalCorrect;
    updateScoreboard();
    setQuestion();
    answerInput.focus();
});

function openLeaderboardFromIntro() {
    setLeaderboardMode("normal");
    leaderboardModalElement.classList.remove("hidden");
    loadLeaderboard();
}

function openLeaderboardFromRound() {
    setLeaderboardMode(getCurrentModeKey());
    leaderboardModalElement.classList.remove("hidden");
    loadLeaderboard();
}

function closeLeaderboard() {
    leaderboardModalElement.classList.add("hidden");
}

if (introLeaderboardButton && leaderboardModalElement) {
    introLeaderboardButton.addEventListener("click", openLeaderboardFromIntro);
}

if (inroundLeaderboardButton && leaderboardModalElement) {
    inroundLeaderboardButton.addEventListener("click", openLeaderboardFromRound);
}

if (leaderboardCloseButton && leaderboardModalElement) {
    leaderboardCloseButton.addEventListener("click", closeLeaderboard);
}

if (leaderboardNormalButton) {
    leaderboardNormalButton.addEventListener("click", function() {
        setLeaderboardMode("normal");
        loadLeaderboard();
    });
}

if (leaderboardHardButton) {
    leaderboardHardButton.addEventListener("click", function() {
        setLeaderboardMode("hard");
        loadLeaderboard();
    });
}

window.onload = function() {
    try {
        const storedName = window.localStorage.getItem("sle-prep-name");
        if (storedName && playerNameInput) {
            playerNameInput.value = storedName;
        }
    } catch (_) {
        // ignore
    }

    document.getElementById("begin-btn").focus();
};