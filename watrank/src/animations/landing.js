import anime from 'animejs/lib/anime.es.js';


function displayLogo(container, baseRanker) {
    const top = baseRanker.cloneNode(true);
    const bottom = baseRanker.cloneNode(true);
    top.classList.remove('hidden')
    bottom.classList.remove('hidden')

    top.style.top = '46%';
    top.style.left = '50%';
    top.style.transform = 'scale(1.3)'
    bottom.style.top = '53%';
    bottom.style.left = '50%';
    bottom.style.transform = 'scale(1.3)'

    container.appendChild(top);
    container.appendChild(bottom);
}

export async function animateRankings(container, baseRanker, baseLine) {
    baseRanker = baseRanker.cloneNode(true)
    // baseRanker.classList.add('-m-4', 'w-8', 'h-8', 'absolute');
    console.log(baseRanker)

    displayLogo(container, baseRanker);

    const colors = ['#FA7014', '#14FA27', '#8314FA', '#269DF3', '#cc2cf2'];

    const rankers = rankerCircle(baseRanker, 40, colors.length);
    const lines = linesCircle(baseLine, 30, colors.length);

    const senderIdx = anime.random(0, colors.length);

    colors.forEach((color, idx) => {
        const ranker = rankers[idx];
        const line = lines[idx];

        ranker.classList.remove('hidden')
        line.classList.remove('hidden')

        ranker.querySelector('path').setAttribute('fill', color);

        const lineColor = idx === senderIdx ? `${color}` : 'gold';
        line.classList.add(`border-${lineColor}`, `bg-${lineColor}`, `drop-shadow-[0_0_10px_${lineColor}]`)

        container.appendChild(ranker);
        container.appendChild(line);
    })

    const animation = animateSend(...partitionSenderAndReceivers(senderIdx, lines));

    playAnimationWhenInView(animation, container);
}

export async function animateHeart(container, heart) {
    heart.classList.remove('hidden')
    heart.querySelector('path').classList.add('stroke-red-500')
    heart.classList.add(`drop-shadow-[0_0_3px_red]`);
    heart.classList.add('w-32')

    container.appendChild(heart)

    let tl = anime.timeline({
        loop: true,
        easing: 'easeInOutSine',
        duration: 1500,
    })

    tl.add({
        targets: heart.querySelector('path'),
        strokeDashoffset: [anime.setDashoffset, 0]
    }).add({
        targets: heart,
        width: ['7rem', '9rem'],
        height: ['7rem', '9rem']
    }).add({
        targets: heart,
        opacity: 0
    }, "+=1000")
}


function animateSend(sender, receivers) {
    let tl = anime.timeline({
        loop: true,
        easing: 'easeInOutSine',
        duration: 800,
    })

    tl.add({
        targets: sender,
        width: 0
    }).add({
        targets: sender,
        translateX: 50,
    }, 0).add({
        targets: sender,
        opacity: 0
    }, "-=600")


    tl.add({
        targets: receivers,
        opacity: [0, 1],
    }).add({
        targets: receivers,
        width: [0, 18],
        duration: 500,
        translateX: [60, 0],
    }, "-=600").add({
        targets: receivers,
        opacity: 0,
        delay: 2000,
        duration: 800,
    })

    return tl;
}

function partitionSenderAndReceivers(senderIdx, lines) {
    const cloneLines = lines.slice();
    const removedLine = cloneLines.splice(senderIdx, 1)[0];
    return [removedLine, cloneLines];
}

function rankerCircle(baseRanker, r, n) {
    let rankers = [];
    for (let i = 0; i < n; i++) {
        const theta = 2 * Math.PI * i / n - Math.PI / 2;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const left = x + 50;
        const top = y + 50;
        const initialRotation = theta * 180 / Math.PI - 90;

        const ranker = baseRanker.cloneNode(true);

        ranker.style.top = top + '%';
        ranker.style.left = left + '%';
        ranker.style.transform = `rotate(${initialRotation}deg)`;

        rankers.push(ranker);
    }
    return rankers;
}

function linesCircle(baseLine, r, n) {
    let lines = [];
    for (let i = 0; i < n; i++) {
        const theta = 2 * Math.PI * i / n - Math.PI / 2;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const left = x + 50;
        const top = y + 50;
        const initialRotation = theta * 180 / Math.PI + 180;

        const line = baseLine.cloneNode(true);

        line.style.top = top + '%';
        line.style.left = left + '%';
        line.style.width = (r - 15) + '%';
        line.style.transform = `rotate(${initialRotation}deg)`;

        lines.push(line);
    }
    return lines;
}


export function animateContributions(container) {
    const [header, ...rest] = [...container.children]

    let tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 800,
        autoplay: false
    }).add({
        targets: container,
        scale: [0, 1],
    })

    rest.forEach(row => tl.add({
        targets: row,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 500,
    }, "-=400"))

    playAnimationWhenInView(tl, container);
}

export function animateAnalytics(container) {
    const [bars, axis] = [...container.children]

    let tl = anime.timeline({
        easing: 'easeOutExpo',
        duration: 800,
        autoplay: false
    }).add({
        targets: container,
        scale: [0, 1],
    })

    Array.from(bars.children).forEach((elem, idx, arr) => tl.add({
        targets: elem,
        height: ['0%', ((arr.length - idx) / arr.length * 100) * 0.8 + '%'],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeInOutElastic(1, .6)'
    }, "-=600"))

    playAnimationWhenInView(tl, container);
}

function playAnimationWhenInView(animation, target) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animation.play()
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.8,
    });
    observer.observe(target);
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div;
}

export async function animateRankers(container, baseRanker) {
    const colors = ['#FA7014', '#14FA27', '#8314FA', '#269DF3'];

    colors.forEach(color => continuouslySpawnRanker(container, baseRanker, color));
}

function continuouslySpawnRanker(container, baseRanker, color) {
    spawnRanker(container, baseRanker, color,
        () => continuouslySpawnRanker(container, baseRanker, color))
}

function spawnRanker(container, baseRanker, color, callback) {
    const top = anime.random(1, 100);
    const left = anime.random(1, 100);
    const initialRotation = anime.random(0, 359);
    const rotationDelta = anime.random(-90, 90);
    const movement = anime.random(30, 80);
    const duration = anime.random(3000, 4000);
    const delay = anime.random(500, 2000);

    const ranker = baseRanker.cloneNode(true);
    ranker.classList.remove('hidden')
    ranker.querySelector('path').setAttribute('fill', color);

    ranker.style.top = top + '%';
    ranker.style.left = left + '%';
    ranker.style.transform = `rotate(${initialRotation}deg)`;

    container.appendChild(ranker);

    anime({
        targets: ranker,
        keyframes: [
            { scale: [0, 1] },
            { rotate: initialRotation + rotationDelta },
            { translateY: -movement },
            { opacity: 0 },
        ],
        duration,
        delay,
        easing: 'easeOutElastic(1, .8)',
        complete: () => {
            ranker.remove()
            callback()
        }
    });
}


