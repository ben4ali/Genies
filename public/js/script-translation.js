let languageMenu = document.querySelector('.languageMenu');
let dropMenu = document.querySelector('.dropMenu');
let dropopen = false;
let selectedLanguage = "EN"
const dropBtn = document.getElementById('dropBtn');
dropBtn.addEventListener('click', () => {
    if (dropopen) {
        dropopen = false;
        gsap.to(dropMenu, {
            duration: 0.5,
            height: 0,
            ease: "power2.inOut"
        });
    } else {
        dropopen = true;
        gsap.to(dropMenu, {
            duration: 0.5,
            height: "30rem",
            ease: "power2.inOut"
        });
    }
});

let languages = document.querySelectorAll('.language');
const languageCode = document.getElementById('languageCode');
languages.forEach(language => {
    language.addEventListener('click', () => {
        if (dropopen) {
            selectLanguage(language);
            dropopen = false;
            gsap.to(dropMenu, {
                duration: 0.5,
                height: 0,
                ease: "power2.inOut"
            });
        }
    });
});

function selectLanguage(element){
    languages.forEach(language => {
        language.classList.remove('selectedLanguage');
    });
    element.classList.add('selectedLanguage');
    selectedLanguage = element.getAttribute('data-languageCode');
    languageCode.innerHTML = selectedLanguage;
}



const input = document.querySelector('.inputHolder textarea');
const output = document.querySelector('.outputHolder textarea');
const formTranslte = document.querySelector('.toolForm2');
const userIdContent = document.getElementById('userContent').textContent
const detectedLanguage = document.getElementById('detectedLanguage');
formTranslte.addEventListener('submit', (e) => {
    e.preventDefault();
    translate(input.value, selectedLanguage);
});

function translate(text, targetLanguage){
    input.disabled = true;
    formTranslte.querySelector('button').disabled = true;
    //Increment
    $.ajax({
        url: '/api/user/incrementVoiceGenerated',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ userId: userIdContent }),
        success: function(response) {
            console.log('Prompt count incremented successfully:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error incrementing prompt count:', error);
        }
    });
    //Activity
    const activityData = {
        userId: userIdContent,
        action: "Text translated"
    };
    $.ajax({
        url: '/api/user/createActivity',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(activityData),
        success: function(response) {
            console.log('Activity created successfully:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error creating activity:', error);
        }
    });
    //Translate
    $.ajax({
            url: '/api/translate/translateText',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ text: text, target_lang: targetLanguage }),
            success: function(response) {
                //change detected language "Detected Language:"
                detectedLanguage.innerHTML = "Detected Language: " + response.translations[0].detected_source_language;
                gsap.to(output,{
                    opacity: 0,
                    duration: 0.5,
                    x: 150,
                    onComplete: function(){
                        output.value = response.translations[0].text;
                        gsap.to(output,{
                            opacity: 1,
                            x: 0,
                            duration: 0.75,
                            ease: "sine"
                        });
                        input.disabled = false;
                        formTranslte.querySelector('button').disabled = false;
                    }
                })
            },
            error: function(xhr, status, error) {
                console.error('Error translating text:', error);
            }
        });
}