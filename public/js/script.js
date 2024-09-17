document.addEventListener('DOMContentLoaded', () => {
    const interBubble = document.querySelector('.interactive');
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;
    function move() {
        curX += (tgX - curX) / 20;
        curY += (tgY - curY) / 20;
        interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
        requestAnimationFrame(() => {
            move();
        });
    }
    window.addEventListener('mousemove', (event) => {
        tgX = event.clientX;
        tgY = event.clientY;
    });
    move();

    const aboutSection = document.getElementById('about');
    const demoSection = document.getElementById('demo');
    const gradientBg = document.querySelector('.gradient-bg');
    const textContainer = document.querySelector('.text-container');
    const imageHolder = document.getElementById('imgGen');
    const chatBotHolder = document.getElementById('chatBot');

    //About scrollTrigger
    ScrollTrigger.create({
        trigger: aboutSection,
        start: 'top 25%',
        onEnter: () => {
            gsap.to(textContainer, {
                duration: 1,
                opacity: 0
            });
        },
        onLeaveBack: () => {
            gsap.to(textContainer, {
                duration: 1,
                opacity: 1
            });
        }
    });

    //Demo scrollTrigger
    ScrollTrigger.create({
        trigger: demoSection,
        start: 'top 100%',
        onEnter: () => {
            gsap.to(gradientBg, {
                duration: 1,
                opacity: 0
            });
        },
        onLeaveBack: () => {
            gsap.to(gradientBg, {
                duration: 1,
                opacity: 1
            });
        }
    });


    ScrollTrigger.create({
        trigger: imageHolder,
        start: 'top 50%',
        onEnter: () => {
            gsap.to(imageHolder.lastElementChild.children, {
                duration: 0.5,
                opacity: 0.75,
                scale: 1,
                ease: "sine",
                stagger: 0.15,
                x: 0
            });
        },
    });

    const chatinputs = ["Give me a name for a dragon please", "How could I name my legendary sword ?", "How should I call a golem guarding a mountain ?"]
    const chatoutputs = [
        ["Draco", "Saphira", "Fafnir", "Toothless", "Smaug", "Nefarian"], 
        ["Excalibur", "Durandal", "Zephyrblade", "Shadowstrike", "Stormbreaker", "Dragonfang"],
        ["Stone Sentinel", "Terra Titan", "Stone Colossus", "Rock Warden", "Mountain Watcher", "Guardian of the Elements"]
    ];
    let chatIndex = 0;
    const inputChat = document.getElementById('ideaInput');
    const cardHolder = document.querySelector('.cardHolder');
    const cards = document.querySelectorAll('.card');
    function changeInputText() {
        chatIndex++;
        if (chatIndex >= chatinputs.length) {
            chatIndex = 0;
        }
        gsap.to(inputChat, {
            duration: 1,
            text: chatinputs[chatIndex]
        });
        gsap.to(cardHolder.children, {
            duration: 0.75,
            opacity: 0,
            x: -100,
            stagger: 0.1,
            onCompete: () => {
                setTimeout(() => {
                    let cardIndex = 0;
                    cards.forEach(card => {
                        card.children[0].textContent = chatoutputs[chatIndex][cardIndex];
                        cardIndex++;
                        if (cardIndex >= chatoutputs[chatIndex].length) {
                            cardIndex = 0;
                        }
                    });
                }, 1300);

                gsap.to(cardHolder.children, {
                    delay: 1.25,
                    duration: 0.5,
                    opacity: 1,
                    x: 0,
                    stagger: 0.15
                });
            }
        });

        gsap.delayedCall(3.5, changeInputText);
    }
    setTimeout(() => {
        changeInputText();
    }, 3500);
    const musicBar = document.getElementById('musicBar');
    const musicNotes = document.querySelectorAll('.musicNote');
    const musicBarX = musicBar.getBoundingClientRect().x;
    musicNotes.forEach((note, index) => {
        gsap.to(note.firstElementChild, {
            duration: 1.5,
            x: -musicBarX,
            repeat: -1,
            opacity: 0,
            ease: "linear",
            delay: index * 0.35,
        });
    });
});