import * as HELPER from "./helpers.js"

const CONFIG = {
    barsSteps: 8
}

const ITEM = {
    field: document.querySelector("#field"),
    topBar: document.querySelector("#topBar"),
    bottomBar: document.querySelector("#bottomBar"),
    ball: document.querySelector("#ball"),
    barLeft: document.querySelector("#leftBar"),
    barRight: document.querySelector("#rightBar"),
    line: document.querySelector("#fieldLine"),
    newButton: document.querySelector("#newGame"),
    selectionBox: document.querySelector("#selectionBox"),
    terminal: document.querySelector("#terminal")
}

const ROUND = {
    userSelection: null,
    userField: null,
    userBar: null
}

/* new game */
const newGame = async () => {
    await changeSelectionDisplay(true)
    ROUND.userSelection = await waitForSelection()
    configureRound(ROUND)
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

const configureRound = (ROUND) => {
    ROUND.userField = ROUND.userSelection
    ROUND.userBar = document.querySelector(`#${ROUND.userSelection}Bar`)
    ROUND.userBarPos = 4
    ROUND.fieldDim = { "x": ITEM.field.offsetWidth, "y": ITEM.field.offsetHeight }
    ROUND.fieldBar = 50
    ROUND.gameBar = document.querySelector(`#${ROUND.userSelection === "left" ? "right" : "left"}Bar`)
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
    ITEM.barLeft.classList.remove("invisible")
    ITEM.barRight.classList.remove("invisible")
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
    const FRAME = {
        pause: false,
        cancel: false
    }

    /* prepare terminal */
    prepareTerminal(FRAME)
    /*     getFrameInfo(ROUND, FRAME)
     */    /* reactive events */
    activeBars(ROUND, FRAME)
    getFieldDim(ITEM)

    /* stop getFrameInfo at 3s */
    await new Promise(resolve => setTimeout(resolve, 3000))
    FRAME.cancel = true
}
const prepareTerminal = (FRAME) => {
    console.log(FRAME)
    Object.entries(FRAME).forEach(([key, value]) => {
        if (typeof value === "object" && !Array.isArray(value) && !value) {
            prepareTerminal(value)
        } else {
            const line = HELPER.addTag(ITEM.terminal, "div", "infoLine")
            const keyName = HELPER.addTag(line, "span", "keyName")
            keyName.textContent = key.toUpperCase()
            const valueData = HELPER.addTag(line, "span", "valueData")
            valueData.textContent = String(value).toUpperCase()
        }
    })
}

const activeBars = (ROUND, FRAME) => {
    window.addEventListener("wheel", (e) => {
        e.deltaY < 0 && moveBar("up", ROUND, FRAME)
        e.deltaY > 0 && moveBar("down", ROUND, FRAME)
    })
}

const moveBar = (direction, ROUND, FRAME) => {
    const barHeightPercent = (ROUND.userBar.offsetHeight / FRAME.fieldDim.y) * 100
    const moveStep = (100 - barHeightPercent) / CONFIG.barsSteps
    if (direction === "up" && FRAME.userBarPos > 0) FRAME.userBarPos--
    if (direction === "down" && FRAME.userBarPos < CONFIG.barsSteps) FRAME.userBarPos++
    ROUND.userBar.style.top = `${moveStep * FRAME.userBarPos}%`
    console.log(direction, `${moveStep * FRAME.userBarPos}%`, FRAME.userBarPos)
}

const getFrameInfo = async (ROUND, FRAME) => {
    while (!FRAME.cancel) {
        while (FRAME.pause) {
            await new Promise(resolve => requestAnimationgame.FRAME(resolve))
            if (FRAME.cancel) return
        }
        FRAME.barsLimits = getBarLimits(ROUND)
        FRAME.ballPos = getBallPos(FRAME)
        drawTerminal(FRAME)
        await new Promise(requestAnimationFrame)
    }
}

const getBarLimits = (ROUND) => {
    const userBarTop = ROUND.userBar.offsetTop
    const userBarHeight = ROUND.userBar.offsetHeight
    const gameBarTop = ROUND.gameBar.offsetTop
    const gameBarHeight = ROUND.gameBar.offsetHeight
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