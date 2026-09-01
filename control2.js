import * as HELPER from "./helpers.js"

const gameField = document.querySelector("#gameField")
const gameFieldSize = { width: gameField.clientWidth, height: gameField.clientHeight }

const gameElements = {
    ball: document.querySelector("#ball"),
    barLeft: document.querySelector("#barLeft"),
    barRight: document.querySelector("#barRight"),
    fieldSeparator: document.querySelector("#fieldSeparator"),
}

const sideSelectors = document.querySelectorAll(".sideSelector")
const barSteps = 8

const game = {
    side: null,
    speed: 1,
    ballSize: parseFloat(getComputedStyle(gameElements.ball).getPropertyValue("width")),
    ballPos: [
        (50 - (gameElements.ball.offsetWidth / 2 / gameFieldSize.width) * 100) + "%", /* center x absolute */
        (50 - (gameElements.ball.offsetWidth / 2 / gameFieldSize.height) * 100) + "%" /* center y absolute */
    ],
    barSize: (gameElements.barLeft.offsetHeight / gameFieldSize.height) * 100,
    barPos: barSteps / 2
}

console.log(game)

/* const getBallPos = () => { return [gameElements.ball.offsetLeft, gameElements.ball.offsetTop] }
 */
/* PREPARE NEW GAME */
const prepareNewGame = async () => {
    await loadSelectionBox(true)
    game.side = await waitForSelection()
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
                resolve(e.target.id === "gameLeft" ? "left" : "right")
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
    events_moveBar()
    moveBall()
}

const events_moveBar = () => {
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
    let bar = gameSide === "left" ? gameElements.barLeft : gameElements.barRight
    const gameFieldHeight = document.querySelector("#gameField").clientHeight

    barPos === null && (barPos = barSteps / 2)
    const barHeightPercent = (bar.offsetHeight / gameFieldHeight) * 100
    const moveStep = (100 - barHeightPercent) / barSteps
    if (dir === "up" && barPos > 0) barPos--
    if (dir === "down" && barPos < barSteps) barPos++
    bar.style.top = `${moveStep * barPos}%`
}

const moveBall = () => {
    const maxLeft = "0%"
    const maxRight = (gameFieldSize.width - game.ballSize) / gameFieldSize.width * 100 + "%"
    gameElements.ball.style.transition = `${game.speed * 1000}ms linear`
    gameElements.ball.style.left = game.side === "left" ? "0" : maxRight
}

/* init */
const init = async () => {
    await prepareNewGame()
    initGame()

}

init()