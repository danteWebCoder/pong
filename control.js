const gameBox = document.querySelector("#gameBox")
const ball = document.querySelector("#ball")
const barLeft = document.querySelector("#barLeft")
const barRight = document.querySelector("#barRight")
const pressSpace = document.querySelector(".pressSpace")

const ballSize = parseFloat(getComputedStyle(ball).getPropertyValue("width"))
const steps = 8
const tempo = 200

let gameBoxSize = null
let sideLeft = null
let bar = null
let barPos = null /* vertical center */

const getGameBoxSize = () => gameBoxSize = [gameBox.clientWidth, gameBox.clientHeight]
const getBallPos = () => { return [ball.offsetLeft, ball.offsetTop] }
const sleep = async (tempo) => { await new Promise(resolve => setTimeout(resolve, tempo)) }

/* NEW GAME */
const selectSide = () => {
    const sideSelectorLeft = document.querySelector("#sideSelectorLeft")
    const sideSelectorRight = document.querySelector("#sideSelectorRight")

    sideSelectorLeft.addEventListener("change", async (e) => {
        document.activeElement.blur()
        sideLeft = true
        await prepareSide()
        e.target.checked = false
    })

    sideSelectorRight.addEventListener("change", async (e) => {
        document.activeElement.blur()
        sideLeft = false
        await prepareSide()
        e.target.checked = false
    })
}

const prepareSide = async () => {
    sideLeft ? setBallToLeft() : setBallToRight()
    await gameElementsVisibility()
    const pressSpace = activeSpace()
    await loadSpaceBox()
}

/* const setBallToLeft = () => {
    ball.style.left = "40px"
    ball.style.top = `calc(50% - ${ballSize / 2}px)`
}

const setBallToRight = () => {
    ball.style.left = `calc(100% - (${ballSize}px + 40px))`
    ball.style.top = `calc(50% - ${ballSize / 2}px)`
}
 */
/* game intro */
const gameElementsVisibility = async () => {
    const visualElements = [ball, barLeft, barRight];
    const ballTempo = parseFloat(getComputedStyle(ball).getPropertyValue("transition")) * 1000
    visualElements.forEach(item => item.classList.replace("invisible", "visible"))
    await sleep(ballTempo)
}


const unloadSpaceBox = async () => {
    const pressTempo = parseFloat(getComputedStyle(pressSpace).getPropertyValue("transition")) * 1000
    pressSpace.querySelector(".spaceText").classList.add("invisible")
    await sleep(pressTempo)
    pressSpace.classList.remove("pressSpace_expanded")
    pressSpace.classList.add("invisible")
    await sleep(pressTempo)
    pressSpace.classList.add("hidden")
}

const loadSpaceBox = async () => {
    const pressTempo = parseFloat(getComputedStyle(pressSpace).getPropertyValue("transition")) * 1000
    pressSpace.classList.remove("hidden")
    await sleep(50)
    pressSpace.classList.add("pressSpace_expanded")
    pressSpace.classList.remove("invisible")
    await sleep(pressTempo * 2)
    pressSpace.querySelector(".spaceText").classList.remove("invisible")
    pressSpace.classList.add("pressSpace_pulse")
}

const activeSpace = () => {
    document.addEventListener("keypress", async (e) => {
        if (e.code === "Space") {
            unloadSpaceBox()
            shoot()
        }
    })
    return pressSpace
}

/* start game */
const startGame = () => {

}


const activeBarEvents = () => {
    document.addEventListener("keydown", (e) => {
        e.code === "ArrowUp" && moveBar("up")
        e.code === "ArrowDown" && moveBar("down")
    })
}

const moveBar = (dir) => {
    let bar = sideLeft ? barLeft : barRight
    barPos === null && (barPos = steps / 2)
    const moveStep = (gameBox.clientHeight - bar.offsetHeight) / steps
    if (dir === "up" && barPos > 0) barPos--
    if (dir === "down" && barPos < steps) barPos++
    bar.style.top = `${moveStep * barPos}px`
}

/* init */
const init = async () => {
    getGameBoxSize()
    selectSide()
    startGame()
}

init()