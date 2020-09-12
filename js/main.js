(() => {

    let yOffset = 0;
    let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이 합
    let currentScene = 0;   // 현재 활성화된 scroll-section
    let enterNewScene = false;


    const sceneInfo = [
        { // currentScene 0
            type: 'sticky',
            heightNum: 5, // 브라우저 높이의 5배로 총 scrollHeight 세팅
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
                messageA_opacity_out: [0, 1, {start: 0.22, end: 0.3}],
                messageB_opacity: [0, 1, {start: 0.3, end: 0.4}]
            }
        },
        { // currentScene 1
            type: 'normal',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        { // currentScene 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        { // currentScene 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];




    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for(let i=0; i<sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        let totalScrollHeight = 0;
        for (let i=0; i<sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    // 스크롤 할때마다 실행
    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;

        for(let i=0; i<currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > sceneInfo[currentScene].scrollHeight + prevScrollHeight) {
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }

        if (yOffset < prevScrollHeight) {
            if (currentScene === 0)
                return;
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        // console.log(`prevScrollHeight = ${prevScrollHeight}, pageYOffset=${yOffset}, currentScene=${currentScene}`);
    
        if (enterNewScene) 
            return;

        playAnimation();
        
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currenYOffset = yOffset - prevScrollHeight;
        const scrollRatio = currenYOffset / 현재 씬의 scrollHeight

        switch (currentScene) {
            case 0 :
                let messageA_opacity_in = calcValues(values.messageA_opacity_in, currenYOffset);
                let messageA_opacity_out = calcValues(values.messageA_opacity_out, currenYOffset);
                objs.messageA.style.opacity = messageA_opacity_in;
                objs.messageA.style.opacity = messageA_opacity_out;
                break;
            case 1 :
                break;
            case 2 :
                break;
            case 3 :
                break; 
        }
    }

    function calcValues(values, currenYOffset) {
        let res;

        // 현재 scene에서 스크롤 된 범위 비율로 구하기
        const sceneScrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currenYOffset / sceneScrollHeight;
        

        if (values.length === 3) {
            // start~end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * sceneScrollHeight;
            const partScrollEnd = values[2].end * sceneScrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if (partScrollStart <= currenYOffset && currenYOffset <= partScrollEnd){
                res = (currenYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currenYOffset < partScrollStart) {
                res = values[0];
            } else if (currenYOffset > partScrollEnd) {
                res = values[1];
            }
        } else {
            res = scrollRatio * (values[1] - values[0]) + values[0];
        }
        

        return res;
    }

    window.addEventListener('loaded', setLayout);
    // 리사이징 하면 그에 맞는 높이 다시 세팅
    window.addEventListener('resize', setLayout);

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    


    setLayout();
})();
