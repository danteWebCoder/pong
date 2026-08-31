import * as HELPER from "./helpers.js"

const gameField = document.querySelector("#gameField")
const gameElements = {
    ball: document.querySelector("#ball"),
    barLeft: document.querySelector("#barLeft"),
    barRight: document.querySelector("#barRight"),
    fieldSeparator: document.querySelector("#fieldSeparator"),
}

const sideSelectors = document.querySelectorAll(".sideSelector")
let gameSide = null






const ballSize = parseFloat(getComputedStyle(ball).getPropertyValue("width"))
const steps = 8
const tempo = 200

let gameFieldSize = null
let sideLeft = null
let bar = null
let barPos = null /* vertical center */

const getgameFieldSize = () => gameFieldSize = [gameField.clientWidth, gameField.clientHeight]
const getBallPos = () => { return [ball.offsetLeft, ball.offsetTop] }

/* PREPARE NEW GAME */
const prepareNewGame = async () => {
    await loadSelectionBox(true)
    gameSide = await waitForSelection()
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
    return new Promise((resolve) => {
        const controller = new AbortController()
        const { signal } = controller
        sideSelectors.forEach(item => {
            item.addEventListener("click", async (e) => {
                await loadSelectionBox(false)
                await prepareGameField()
                controller.abort()
                resolve(e.target.id === gameLeft ? "left" : "right")
            }, { signal })
        })
    })
}

const prepareGameField = async () => {
    const tempo = HELPER.getTime(gameElements.ball)
    await countDown()
    Object.values(gameElements).forEach(item => item.classList.remove("invisible"))
    await HELPER.sleep(tempo)
}

const countDown = async () => {
    const countDownBox = document.querySelector("#countDownBox")
    countDownBox.classList.remove("hidden")

    for (let i = 3; i >= 0; i--) {
        const number = HELPER.addTag(countDownBox, "div", "absolute number tempo1000")
        number.textContent = i
        await HELPER.sleep(100)
        number.classList.add("number_in")
        await HELPER.sleep(900)
        countDownBox.innerHTML = ""
    }
}

/* INIT GAME */
const initGame = () => {
    const gameFieldHeight = document.querySelector("#gameField").clientHeight
    moveBarEvents(gameFieldHeight)
}

const moveBarEvents = () => {
    document.addEventListener("keydown", (e) => {
        e.code === "ArrowLeft" && moveBar("up")
        e.code === "ArrowRight" && moveBar("down")
    })

    window.addEventListener("wheel", (e) => {
        e.deltaY < 0 && moveBar("up")
        e.deltaY > 0 && moveBar("down")
    })
}

const moveBar = (dir) => {
    let bar = sideLeft ? gameElements.barLeft : gameElements.barRight
    const gameFieldHeight = document.querySelector("#gameField").clientHeight

    barPos === null && (barPos = steps / 2)
    const moveStep = (gameFieldHeight - bar.offsetHeight) / 8
    if (dir === "up" && barPos > 0) barPos--
    if (dir === "down" && barPos < steps) barPos++
    bar.style.top = `${moveStep * barPos}px`
}

/* init */
const init = async () => {
    await prepareNewGame()
    initGame()

}

init()