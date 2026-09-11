import * as HELPER from "./helpers.js"

/* new game */
const newGame = async (gameObject, gameEls, newButton) => {
    await changeSelectionDisplay(true, newButton)
    const userSelection = await waitForSelection()
    configureGame(userSelection, gameObject, gameEls)
    await changeSelectionDisplay(false, newButton)
    await gameCountDown(3)
    await showGameElements(gameEls)
}

const changeSelectionDisplay = async (open, newButton = null) => {
    const selectionBox = document.querySelector("#selectionBox")
    const boxTempo = HELPER.getTime(selectionBox)
    const buttonTempo = HELPER.getTime(newButton)

    if (open) {
        newButton.classList.remove("buttonBox_active")
        newButton.classList.add("invisible")
        await HELPER.sleep(buttonTempo)
        newButton.classList.add("hidden")
        selectionBox.classList.remove("hidden")
        await HELPER.sleepFrame(5)
        selectionBox.classList.remove("invisible")
        selectionBox.classList.replace("selectionBox_contracted", "selectionBox_expanded")
        selectionBox.classList.add("selectionBox_expanded")
        await HELPER.sleep(boxTempo)
        selectionBox.querySelectorAll(".buttonBox").forEach(item => item.classList.add("buttonBox_active"))
    } else {
        selectionBox.querySelectorAll(".buttonBox").forEach(item => item.classList.remove("buttonBox_active"))
        selectionBox.classList.add("invisible")
        selectionBox.classList.replace("selectionBox_expanded", "selectionBox_contracted")
        await HELPER.sleep(boxTempo)
        selectionBox.classList.add("hidden")
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

const configureGame = (userSelection, gameObject, gameEls) => {
    gameObject.userField = userSelection
    gameObject.userBar = document.querySelector(`#${userSelection}Bar`)
    gameObject.userBarPos = 4
    gameObject.fieldDim = { "x": gameEls.field.offsetWidth, "y": gameEls.field.offsetHeight }
    gameObject.fieldBar = 50
    gameObject.barSteps = 8
    gameObject.gameBar = document.querySelector(`#${userSelection === "left" ? "right" : "left"}Bar`)
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

const showGameElements = async (gameEls) => {
    const tempo = HELPER.getTime(gameEls.ball)
    gameEls.barLeft.classList.remove("invisible")
    gameEls.barRight.classList.remove("invisible")
    await HELPER.sleep(tempo * 1.4)
    gameEls.line.classList.remove("invisible")
    await HELPER.sleep(tempo * 1.4)
    gameEls.topBar.classList.replace("topBar_topNegative", "topBar_top")
    await HELPER.sleep(tempo * 1.4)
    gameEls.ball.classList.remove("invisible")
}

/* game logic */
const initGame = async (game) => {

    const frame = {
        pause: false,
        cancel: false
    }

    getFrameInfo(frame, game)
    activeBars(game)

    /* stop getFrameInfo at 3s */
    await new Promise(resolve => setTimeout(resolve, 3000))
    frame.cancel = true
}

const activeBars = (game) => {
    window.addEventListener("wheel", (e) => {
        e.deltaY < 0 && moveBar("up", game)
        e.deltaY > 0 && moveBar("down", game)
    })
}

const moveBar = (direction, game) => {
    const barHeightPercent = (game.userBar.offsetHeight / game.fieldDim.y) * 100
    const moveStep = (100 - barHeightPercent) / game.barSteps
    if (direction === "up" && game.userBarPos > 0) game.userBarPos--
    if (direction === "down" && game.userBarPos < game.barSteps) game.userBarPos++
    game.userBar.style.top = `${moveStep * game.userBarPos}%`
}


const getFrameInfo = async (frame, game) => {
    while (!frame.cancel) {
        while (frame.pause) {
            await new Promise(resolve => requestAnimationFrame(resolve))
            if (frame.cancel) return
        }
        /* logica */
        frame.barsLimits = getBarLimits(game)
/*         console.log(frame)
 */        await new Promise(requestAnimationFrame)
    }
}

const getBarLimits = (game) => {
    const userBarTop = game.userBar.offsetTop
    const userBarHeight = game.userBar.offsetHeight
    const gameBarTop = game.gameBar.offsetTop
    const gameBarHeight = game.gameBar.offsetHeight
    return { user: { start: userBarTop, end: userBarTop + userBarHeight }, game: { start: gameBarTop, end: gameBarTop + gameBarHeight } }
}

/* init */
const init = async () => {
    const newButton = document.getElementById("newGame")
    const gameEls = {
        field: document.querySelector("#gameField"),
        topBar: document.querySelector("#topBar"),
        ball: document.querySelector("#ball"),
        barLeft: document.querySelector("#leftBar"),
        barRight: document.querySelector("#rightBar"),
        line: document.querySelector("#fieldLine")
    }
    console.log(gameEls)

    const game = {}

    newButton.addEventListener("click", async () => {
        await newGame(game, gameEls, newButton)
        initGame(game)
        console.log(game)
    })
}

init()