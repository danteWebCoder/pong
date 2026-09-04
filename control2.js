import * as HELPER from "./helpers.js"

const fieldEl = document.querySelector("#gameField")
const filedInfo = { "x": fieldEl.clientWidth, "y": fieldEl.clientHeight }

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
    ballPos: { x: 50, y: 50 },
    bar: null,
    barSize: null,
    barPos: 4,
    barTop: null
}

const getBallPos = () => { return [game.ballPos.x, game.ballPos.y] }

/* PREPARE NEW GAME */
const prepareNewGame = async () => {
    await loadSelectionBox(true)
    await waitForSelection()
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
                game.side = e.target.id === "selectorLeft" ? "left" : "right"
                game.bar = document.querySelector(game.side === "left" ? "#barLeft" : "#barRight")
                resolve()
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
    moveBall(game.side === "left" ? 0 : 100, -25)
    getFrame()
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

const moveBar = (direction) => {
    const barHeightPercent = (game.bar.offsetHeight / filedInfo.y) * 100
    const moveStep = (100 - barHeightPercent) / barSteps
    if (direction === "up" && game.barPos > 0) game.barPos--
    if (direction === "down" && game.barPos < barSteps) game.barPos++
    game.bar.style.top = `${moveStep * game.barPos}%`
}

const moveBall = (x = null, y = null) => {
    x !== null && (game.ballPos.x = x)
    y !== null && (game.ballPos.y = game.ballPos.y + y)

    gameElements.ball.style.transition = `${game.speed * 1000}ms linear`
    x !== null && (gameElements.ball.style.left = `${game.ballPos.x}%`)
    y !== null && (gameElements.ball.style.top = `${game.ballPos.y}%`)
}

const getPositionBar = () => {
    const bar = game.side === "left" ? gameElements.barLeft : gameElements.barRight
    const barTop = +((bar.offsetTop / filedInfo.y) * 100).toFixed(2) /* + to number instant */
    game.barTop !== barTop && (game.barTop = barTop)
    return barTop
}

const getFrame = () => {
    console.log(getPositionBar())
    requestAnimationFrame(getFrame)
}

/* init */
const init = async () => {
    await prepareNewGame()
    console.log(game)
    initGame()

}

init()