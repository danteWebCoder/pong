import * as HELPER from "./helpers.js"

/* new game */
const newGame = async (gameObject, gameEls) => {
    await loadSelectionBox(true)
    const userSelection = await waitForSelection()
    configureGame(userSelection, gameObject, gameEls)

    await gameCountDown(3)
    await showGameElements(gameEls)
}

const loadSelectionBox = async (open) => {
    const selectionBox = document.querySelector("#selectionBox")
    const boxTempo = HELPER.getTime(selectionBox)
    if (open) {
        selectionBox.classList.remove("hidden")
        await HELPER.sleep(100)
        selectionBox.classList.remove("invisible", "selectionBox_contracted")
        selectionBox.classList.add("selectionBox_expanded")
        await HELPER.sleep(boxTempo)
    } else {
        selectionBox.classList.remove("selectionBox_expanded")
        selectionBox.classList.add("invisible", "selectionBox_contracted")
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
                await loadSelectionBox(false)
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
    gameObject.userBarLimits = null /* funcion calcular limtes barra */
    gameObject.fieldDim = { "x": gameEls.field.offsetWidth, "y": gameEls.field.offsetHeight }
    gameObject.fieldBar = 50
    gameObject.barSteps = 8
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
    Object.values(gameEls).forEach(item => item.classList.remove("invisible"))
    await HELPER.sleep(tempo)
}

/* game logic */
const initGame = (game) => {
    activeBars(game)
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

/* init */
const init = async () => {
    const newButton = document.getElementById("new")
    const gameEls = {
        ball: document.querySelector("#ball"),
        barLeft: document.querySelector("#leftBar"),
        barRight: document.querySelector("#rightBar"),
        line: document.querySelector("#fieldLine"),
        field: document.querySelector("#gameField")
    }

    const game = {}

    newButton.addEventListener("click", async () => {
        await newGame(game, gameEls)
        initGame(game)
        console.log(game)
    })
}

init()