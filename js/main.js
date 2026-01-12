// const button = document.querySelector('#menu-btn');


// // 햄버거 버튼
// button.addEventListener('click', (e) => {
//     e.preventDefault();

//     if (button.classList.contains('open')) {
//         button.classList.remove('open');
//         button.classList.add('close');
//     } else {
//         button.classList.remove('close');
//         button.classList.add('open');
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    // GSAP 플러그인 등록
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    
    // CustomEase 생성
    if (typeof CustomEase !== 'undefined') {
        gsap.registerPlugin(CustomEase);
        CustomEase.create('hop', '.87,0,.13,1');
    }

    // Lenis 스무스 스크롤 (선택사항)
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis();
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // SplitText 애니메이션 설정
    const textContainers = document.querySelectorAll('.menu-col');
    let splitTextByContainer = [];

    if (typeof SplitText !== 'undefined') {
        textContainers.forEach((container) => {
            const textElements = container.querySelectorAll('a, p');
            let containerSplits = [];

            textElements.forEach((element) => {
                const split = new SplitText(element, {
                    type: 'lines',
                    linesClass: 'line',
                });
                containerSplits.push(split);

                gsap.set(split.lines, { y: '-110%' });
            });

            splitTextByContainer.push(containerSplits);
        });
    }

    // 메뉴 요소 선택
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuOverlayContainer = document.querySelector('.menu-overlay-content');
    const menuMediaWrapper = document.querySelector('.menu-media-wrapper');
    const copyContainers = document.querySelectorAll('.menu-col');
    const menuToggleLabel = document.querySelector('.menu-toggle-label p');
    const hamburgerIcon = document.querySelector('.menu-hamburger-icon');
    const menuLinks = document.querySelectorAll('.menu-link a');

    let isMenuOpen = false;
    let isAnimating = false;

    // 메뉴 열기 함수
    function openMenu() {
        if (isAnimating) return;
        isAnimating = true;

        if (lenis) lenis.stop();

        const tl = gsap.timeline();

        tl.to(menuToggleLabel, {
            y: '-110%',
            duration: 1,
            ease: 'hop',
        }, '<')
        .to(menuOverlay, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1,
            ease: 'hop',
        }, '<')
        .to(menuOverlayContainer, {
            yPercent: 0,
            duration: 1,
            ease: 'hop',
        }, '<')
        .to(menuMediaWrapper, {
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            delay: 0.5,
        }, '<');

        if (splitTextByContainer.length > 0) {
            splitTextByContainer.forEach((containerSplits) => {
                const copyLines = containerSplits.flatMap((split) => split.lines);
                tl.to(copyLines, {
                    y: '0%',
                    duration: 2,
                    ease: 'hop',
                    stagger: -0.075,
                }, -0.15);
            });
        }

        hamburgerIcon.classList.add('active');

        tl.call(() => {
            isAnimating = false;
        });

        isMenuOpen = true;
    }

    // 메뉴 닫기 함수
    function closeMenu(callback) {
        if (isAnimating) return;
        isAnimating = true;

        hamburgerIcon.classList.remove('active');
        const tl = gsap.timeline();

        tl.to(menuOverlay, {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            duration: 0.5,
            ease: 'hop',
        }, '<')
        .to(menuOverlayContainer, {
            yPercent: -50,
            duration: 0.5,
            ease: 'hop',
        }, '<')
        .to(menuToggleLabel, {
            y: '0%',
            duration: 0.5,
            ease: 'hop',
        }, '<')
        .to(copyContainers, {
            opacity: 0.25,
            duration: 0.5,
            ease: 'hop',
        }, '<');

        tl.call(() => {
            if (splitTextByContainer.length > 0) {
                splitTextByContainer.forEach((containerSplits) => {
                    const copyLines = containerSplits.flatMap((split) => split.lines);
                    gsap.set(copyLines, { y: '-110%' });
                });
            }

            gsap.set(copyContainers, { opacity: 1 });
            gsap.set(menuMediaWrapper, { opacity: 0 });

            isAnimating = false;
            if (lenis) lenis.start();

            if (callback) callback();
        });

        isMenuOpen = false;
    }

    // 메뉴 토글 버튼 클릭
    menuToggleBtn.addEventListener('click', () => {
        if (!isMenuOpen) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    // 메뉴 링크 클릭 이벤트
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const sectionClass = link.getAttribute('data-section');
            const targetSection = document.querySelector(`.${sectionClass}`);
            
            if (targetSection) {
                closeMenu(() => {
                    // 메뉴가 완전히 닫힌 후 스크롤
                    gsap.to(window, {
                        duration: 1.5,
                        scrollTo: {
                            y: targetSection,
                            offsetY: 0
                        },
                        ease: 'power2.inOut'
                    });
                });
            }
        });
    });

    // SVG 라인 드로잉 애니메이션
    const svgPath = document.querySelector('.profile .line path');
    if (svgPath) {
        const pathLength = svgPath.getTotalLength();
        
        svgPath.style.strokeDasharray = pathLength;
        svgPath.style.strokeDashoffset = pathLength;
        
        gsap.to(svgPath, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: 'power2.inOut',
            scrollTrigger: {
                trigger: '.profile',
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1,
            }
        });
    }
});

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

let splitHeader = SplitText.create(".headerText", {
  type: "chars",
  mask: "chars",
});

let splitP = SplitText.create(".p", {
  type: "lines",
  mask: "lines", 
});

const tl = gsap.timeline({
  repeat: 12,
  repeatDelay: 1,
  yoyo: true,
});

tl.from (splitHeader.chars, {
  filter: "blur(6px)",
  y: "-15%",
  opacity: 0,
  scale: 0.95,
  duration: 1.2,
  scrambleText: {
    text: "#",
    speed: 0.15,
  },
  stagger: {
    each: 0.3,
    from: "left"
  },
  ease: "power2.out",
})
.from (splitP.lines, {
  filter: "blur(10px)",
  delay: 0.55,
  opacity: 0,
  scale: 0.95,
  y: "100%",
  duration: 0.55,
  ease: "power1.out",
})
.to(splitHeader.chars, {
  opacity: 100,
  y: "0%",
  duration: 0.2,
})