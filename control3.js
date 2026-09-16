import * as HELPER from "./helpers.js"

const CONFIG = {
    barsSteps: 8
}

const ITEM = {
    field: document.querySelector("#field"),
    topBar: document.querySelector("#topBar"),
    bottomBar: document.querySelector("#bottomBar"),
    ball: document.querySelector("#ball"),
    bar_left: document.querySelector("#leftBar"),
    bar_right: document.querySelector("#rightBar"),
    line: document.querySelector("#fieldLine"),
    newButton: document.querySelector("#newGame"),
    selectionBox: document.querySelector("#selectionBox"),
    terminal: document.querySelector("#terminal")
}

const ROUND = {
    state: {
        pause: false,
        cancel: false,
        fieldDim: { x: null, y: null }
    },
    user: {
        selection: null,
        bar: null, /* not visible */
        barPos: CONFIG.barsSteps / 2,
        barLimits: null
    },
    game: {
        selection: null,
        bar: null, /* not visible */
        barPos: CONFIG.barsSteps / 2
    }
}

/* new game */
const newGame = async () => {
    await changeSelectionDisplay(true)
    const selection = await waitForSelection()
    configureRound(selection)
    await changeSelectionDisplay(false)
    await gameCountDown(3)
    await showGameElements()
}

const changeSelectionDisplay = async (open) => {
    const boxTempo = HELPER.getTime(ITEM.selectionBox)
    const buttonTempo = HELPER.getTime(ITEM.newButton)

    if (open) {
        ITEM.newButton.classList.remove("buttonBox_active")
        ITEM.newButton.classList.add("invisible")
        await HELPER.sleep(buttonTempo)
        ITEM.newButton.classList.add("hidden")
        ITEM.selectionBox.classList.remove("hidden")
        await HELPER.sleepFrame(5)
        ITEM.selectionBox.classList.remove("invisible")
        ITEM.selectionBox.classList.replace("selectionBox_contracted", "selectionBox_expanded")
        ITEM.selectionBox.classList.add("selectionBox_expanded")
        await HELPER.sleep(boxTempo)
        ITEM.selectionBox.querySelectorAll(".buttonBox").forEach(item => item.classList.add("buttonBox_active"))
    } else {
        ITEM.selectionBox.querySelectorAll(".buttonBox").forEach(item => item.classList.remove("buttonBox_active"))
        ITEM.selectionBox.classList.add("invisible")
        ITEM.selectionBox.classList.replace("selectionBox_expanded", "selectionBox_contracted")
        await HELPER.sleep(boxTempo)
        ITEM.selectionBox.classList.add("hidden")
    }
}

const waitForSelection = async () => {
    const sideSelectors = document.querySelectorAll(".sideSelector")
    return new Promise((resolve) => {
        const controller = new AbortController()
        const { signal } = controller
        sideSelectors.forEach(item => {
            item.addEventListener("click", async (e) => {
                controller.abort()
                resolve(e.target.id === "selectorLeft" ? "left" : "right")
            }, { signal })
        })
    })
}

const configureRound = (selection) => {
    ROUND.state.fieldDim = getFieldDim()
    /* user */
    ROUND.user.selection = selection
    ROUND.user.bar = getBars().user
    ROUND.user.barLimits = getBarLimits().user
    /* game */
    ROUND.game.selection = selection === "left" ? "right" : "left"
    ROUND.game.bar = getBars().game
    ROUND.game.barLimits = getBarLimits().game
}

const getBars = () => {
    return {
        "user": ITEM[`bar_${ROUND.user.selection}`],
        "game": ITEM[`bar_${ROUND.user.selection === "left" ? "right" : "left"}`]
    }
}

const gameCountDown = async (time) => {
    const countDownBox = document.querySelector("#countDownBox")
    countDownBox.classList.remove("hidden")

    for (let i = time; i >= 0; i--) {
        const number = HELPER.addTag(countDownBox, "div", "absolute number tempo1000")
        number.textContent = i
        await HELPER.sleep(100)
        number.classList.add("number_in")
        await HELPER.sleep(900)
        countDownBox.innerHTML = ""
    }
}

const showGameElements = async () => {
    const tempo = HELPER.getTime(ITEM.ball)
    ITEM.bar_left.classList.remove("invisible")
    ITEM.bar_right.classList.remove("invisible")
    await HELPER.sleep(tempo * 1.4)
    ITEM.line.classList.remove("invisible")
    await HELPER.sleep(tempo * 1.4)
    ITEM.topBar.classList.replace("topBar_boxOut", "topBar_boxIn")
    ITEM.bottomBar.classList.replace("bottomBar_boxOut", "bottomBar_boxIn")
    await HELPER.sleep(tempo * 1.4)
    ITEM.ball.classList.remove("invisible")
}

/* game logic */
const initGame = async () => {

    /* prepare terminal */
    prepareTerminal(ROUND, ITEM.terminal)
    /*     getFrameInfo(ROUND, FRAME)
     */    /* reactive events */
    activeBars(ROUND)

    /* stop getFrameInfo at 3s */
    await new Promise(resolve => setTimeout(resolve, 3000))
    ROUND.state.cancel = true
}

const prepareTerminal = (obj, parent) => {
    const excludeVisibility = ["bar"] /* saltar estas keys */

    const addSection = (key, value) => {
        const section = HELPER.addTag(ITEM.terminal, "li", "terminalSection column")
        section.textContent = key.toUpperCase()
        prepareTerminal(value, section)
    }

    const addLine = (parent, key, value) => {
        const line = HELPER.addTag(parent, "div", "infoLine")
        const keyName = HELPER.addTag(line, "span", "keyName")
        keyName.textContent = key.toUpperCase()
        const valueData = HELPER.addTag(line, "span", "valueData", key)
        valueData.textContent = String(value).toUpperCase()
    }

    Object.entries(obj).forEach(([key, value]) => {
        console.log(key, typeof value)
        if (!excludeVisibility.includes(key)) {
            if (typeof value === "object" && !Array.isArray(value) && value) {
                if (parent === ITEM.terminal) {
                    addSection(key, value)
                } else {
                    Object.entries(value).forEach(([item, subValue]) => {
                        addLine(parent, `${key + " " + item}`, subValue)
                    })
                }
            } else {
                addLine(parent, key, value)
            }
        }
    })
}

const activeBars = (FRAME) => {
    window.addEventListener("wheel", (e) => {
        e.deltaY < 0 && moveBar("up", FRAME)
        e.deltaY > 0 && moveBar("down", FRAME)
    })
}

const moveBar = (direction, FRAME) => {
    const barHeightPercent = (getBars().user.offsetHeight / FRAME.fieldDim.y) * 100
    const moveStep = (100 - barHeightPercent) / CONFIG.barsSteps
    if (direction === "up" && FRAME.userBarPos > 0) FRAME.userBarPos--
    if (direction === "down" && FRAME.userBarPos < CONFIG.barsSteps) FRAME.userBarPos++
    ROUND.userBar.style.top = `${moveStep * FRAME.userBarPos}%`
    console.log(direction, `${moveStep * FRAME.userBarPos}%`, FRAME.userBarPos)
}

const getFrameInfo = async () => {
    while (!ROUND.state.cancel) {
        while (ROUND.pause) {
            await new Promise(resolve => requestAnimationgame.ROUND(resolve))
            if (ROUND.cancel) return
        }
        ROUND.barsLimits = getBarLimits(ROUND)
        ROUND.ballPos = getBallPos(ROUND)
        drawTerminal(ROUND)
        await new Promise(requestAnimationFrame)
    }
}

const getBarLimits = () => {
    const userBarTop = getBars().user.offsetTop
    const userBarHeight = getBars().user.offsetHeight
    const gameBarTop = getBars().game.offsetTop
    const gameBarHeight = getBars().game.offsetHeight
    return {
        user: {
            start: userBarTop,
            end: userBarTop + userBarHeight
        },
        game: {
            start: gameBarTop,
            end: gameBarTop + gameBarHeight
        }
    }
}

const getBallPos = (FRAME) => {
    const ballRect = ITEM.ball.getBoundingClientRect()
    const fieldRect = ITEM.field.getBoundingClientRect()

    const xPx = ballRect.left - fieldRect.left
    const yPx = ballRect.top - fieldRect.top

    return {
        x: (xPx / FRAME.fieldDim.x) * 100,
        y: (yPx / FRAME.fieldDim.y) * 100
    }
}


const getFieldDim = () => {
    return { 'x': ITEM.field.offsetWidth, 'y': ITEM.field.offsetHeight }
}


/* init */
const init = async () => {

    const FRAME2 = {
        pause: false,
        cancel: false,
        fieldDim: { "x": ITEM.field.offsetWidth, "y": ITEM.field.offsetHeight }, /* de funcion getFieldDim on resize */
        barsLimits: {},
        userBarPos: CONFIG.barsSteps / 2,
        ballPos: 0 /* de funcion getBallPos */
    }

    ITEM.newButton.addEventListener("click", async () => {
        await newGame()
        initGame()
    })
}

init()