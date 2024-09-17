const voiceForm = document.querySelector('.voiceform');
const audioPlayerContainer = document.querySelector('.audioPlayer');
const voiceHolder = document.querySelector('.voicesHolder');
const voices = document.querySelectorAll('.voice');
const textInput = document.getElementById('textInput');
const userIdContent = document.getElementById('userContent').textContent
let selectedVoice = "alloy";

gsap.to(voiceHolder.children, {
    duration: 1,
    y: 0,
    opacity: 1,
    stagger: 0.1,
    ease: "power3.out"
});

voices.forEach(voice => {
    voice.addEventListener('click', () => {
        selectVoice(voice);
    });
});

function selectVoice(element){
    voices.forEach(voice => {
        voice.classList.remove('selectedVoice');
    });
    element.classList.add('selectedVoice');
    selectedVoice = element.getAttribute('data-voice');
}


voiceForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = textInput.value;
    generateVoice(text, selectedVoice);
});

function generateVoice(text, voice) {
    //Activity
    const activityData = {
        userId: userIdContent,
        action: "Text to speech",
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
    //Generate voice
    $.ajax({
        url: '/api/voice/textvoice',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ text: text, voice: voice }),
        xhrFields: {
            responseType: 'blob'
        },
        success: function(response ) {
            handleAudioStream(response);
        },
        error: function(xhr, status, error) {
            console.error('Error generating voice:', error);
        }
    });
}

function handleAudioStream(stream) {
    const audio = new Audio();
    audio.src = URL.createObjectURL(stream);
    audio.controls = true; 
    audioPlayerContainer.innerHTML = '';
    audioPlayerContainer.appendChild(audio);
    audio.play();
}