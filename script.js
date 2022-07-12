const chooseImageBtn = document.querySelector('.choose-img'),
fileImg = document.querySelector('.fileImg'),
previewImg = document.querySelector('.preview img'),
container = document.querySelector('.container'),
options = document.querySelectorAll('.filters .options button'),
rotates = document.querySelectorAll('.rotate .options button'),
filterName = document.querySelector('.filter-info .filter-name'),
filterValue = document.querySelector('.filter-info .filter-value'),
filterRange = document.querySelector('.range input'),
resetButton = document.querySelector('.resetBtn'),
saveButton = document.querySelector('.save-img')

let brightness = {
    value: 100,
    max: 200,
    min: 0
}
let saturation = {
    value: 100,
    max: 200,
    min: 0
}
let inversion = {
    value: 0,
    max: 100,
    min: 0
}
let grayScale = {
    value: 0,
    max: 100,
    min: 0
}
let rotateDeg = 0, rotateVert = 1, rotateHotiz = 1;

// Event for choose image button
chooseImageBtn.addEventListener('click', () => fileImg.click())

// Preview loaded image
fileImg.addEventListener('change', () => {
    const file = fileImg.files[0]
    if (!file) return;
    previewImg.src = URL.createObjectURL(file)
    resetButton.click()
    container.classList.remove('disable')
})

function defaultFilter({value, max, min}) {
    filterValue.innerHTML = value + '%'
    filterRange.max = max
    filterRange.mim = min
    filterRange.value = value
}

function switchDefault(id) {
    switch (id) {
        case 'brightness':
            defaultFilter(brightness)
            break;
        case 'saturation':
            defaultFilter(saturation)
            break;
        case 'inversion':
            defaultFilter(inversion)
            break
        default:
            defaultFilter(grayScale)
    }
}

let activeFilter = document.querySelector('.options .active');
options.forEach(option => {
    option.addEventListener('click', () => {
        activeFilter = document.querySelector('.options .active')
        activeFilter.classList.remove('active')
        option.classList.add('active')
        activeFilter = option
        filterName.innerText = option.innerText

        switchDefault(option.id)
    })
});

function applyFilter() {
    previewImg.style.filter = `brightness(${brightness.value}%) saturate(${saturation.value}%) invert(${inversion.value}%) grayscale(${grayScale.value}%)`
    previewImg.style.transform = `rotate(${rotateDeg}deg) scaleX(${rotateVert}) scaleY(${rotateHotiz})`
}

filterRange.addEventListener('input', () => {
    switch (activeFilter.id) {
        case 'brightness':
            brightness.value = filterRange.value
            filterValue.innerText = brightness.value + '%'
            break;
        case 'saturation':
            saturation.value = filterRange.value
            filterValue.innerText = saturation.value + '%'
            break;
        case 'inversion':
            inversion.value = filterRange.value
            filterValue.innerText = inversion.value + '%'
            break;
        case 'grayscale':
            grayScale.value = filterRange.value
            filterValue.innerText = grayScale.value + '%'
            break;
    }
    if(!container.classList.contains('disable')) applyFilter()
})

rotates.forEach((rotate) => {
    rotate.addEventListener('click', () => {
        switch (rotate.id) {
            case 'right':
                rotateDeg += 90;
                break;
            case 'left':
                rotateDeg -= 90;
                break;
            case 'vertical':
                rotateVert = rotateVert === 1 ? -1 : 1
                break;
            case 'horizontal':
                rotateHotiz = rotateHotiz === 1 ? -1 : 1
                break;
        }
        if(!container.classList.contains('disable')) applyFilter()
    })
})

resetButton.addEventListener('click', () => {
    brightness.value = 100
    saturation.value = 100
    inversion.value = 0
    grayScale.value = 0
    rotateDeg = 0
    rotateVert = 1
    rotateHotiz = 1
    applyFilter()
    switchDefault(activeFilter.id)
})

saveButton.addEventListener('click', () => {
    if (!container.classList.contains('disable')) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        canvas.width = previewImg.naturalWidth
        canvas.height = previewImg.naturalHeight

        ctx.filter = `brightness(${brightness.value}%) saturate(${saturation.value}%) invert(${inversion.value}%) grayscale(${grayScale.value}%)`
        ctx.translate(canvas.width / 2, canvas.height / 2)
        if (rotateDeg !== 0) {
            ctx.rotate(rotateDeg * Math.PI / 180)
        }
        ctx.scale(rotateVert, rotateHotiz)
        ctx.drawImage(previewImg, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)

        const link = document.createElement('a')
        link.download = 'image.jpg'
        link.href = canvas.toDataURL()
        link.click()
    }
})

previewImg.addEventListener('click', () => chooseImageBtn.click())