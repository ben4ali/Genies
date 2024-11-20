const expandBtn = document.getElementById('expandBtn');
const verticalBar = document.querySelector('.verticalBar');
const addBtn = document.getElementById('newThread');
const userContent = document.getElementById('userContent');
const userId = userContent.textContent
const loadingResponse = document.getElementById('loadingResponse');
const chatContainer = document.querySelector('.chatContainer');
const suggestionHolder = document.querySelector('.suggestionHolder');
const suggestions = document.querySelectorAll('.suggestion');
const welcomeHolder = document.querySelector('.welcomeHolder');
const languageForm = document.getElementById('languageForm');
const languageInput = document.getElementById('inputText');
const imgContent = document.getElementById('imgContent');

let typing = false;
let currentConvoId = '';
let menuState = false;

expandBtn.addEventListener('click', () => {
    if (menuState) {
        menuState = false;
        gsap.to(verticalBar, {
            duration: 0.5,
            width: '5rem'
        });
        gsap.to(addBtn, {
            duration: 0.5,
            width: '3rem'
        });
        document.querySelectorAll('.conversation').forEach(convo => {
            gsap.to(convo, {
                duration: 0.2,
                opacity: 0
            });
        });
    }else{
        menuState = true;
        gsap.to(verticalBar, {
            duration: 0.5,
            width: '20rem'
        });
        gsap.to(addBtn, {
            delay: 0.1,
            duration: 0.5,
            width: '12rem'
        });
        document.querySelectorAll('.conversation').forEach(convo => {
            gsap.to(convo, {
                delay: 0.2,
                duration: 0.5,
                opacity: 1
            });
        });
    }
});
addBtn.addEventListener('click', () => {
    if (!document.querySelector('.welcomeHolder')) {
        //remove everything from chatContainer except loadingResponse
        while (chatContainer.firstChild) {
            if (chatContainer.firstChild === loadingResponse) {
                chatContainer.innerHTML = '';
                chatContainer.appendChild(loadingResponse);
                break;
            }
            chatContainer.removeChild(chatContainer.firstChild);
        }
        chatContainer.append(welcomeHolder);
        chatContainer.append(suggestionHolder);
    }
});

languageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendChat(languageInput.value);

});

suggestions.forEach(suggestion => {
    suggestion.addEventListener('click', () => {
        sendChat(suggestion.textContent);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    getAllConversations();
});

function getAllConversations(){
    $.ajax({
        url: '/api/language/getConversation?'+userId,
        type: 'GET',
        data: { userId: userId },
        success: function(conversations) {
            conversations.reverse().forEach(function(conversation) {
                const convo = document.createElement('div');
                convo.classList.add('conversation');
                //Anchor
                const convoLink = document.createElement('a');
                convoLink.setAttribute('data-conversation-id', conversation.conversationId);
                convoLink.textContent = conversation.title;
                convo.appendChild(convoLink);
                verticalBar.appendChild(convo);
                //Options
                const convoOptions = document.createElement('div');
                convoOptions.classList.add('convMenu');
                //Icons
                const starIcon = document.createElement('i');
                starIcon.classList.add('saveBtn');
                starIcon.classList.add('bi');
                if (conversation.saved) {
                    starIcon.classList.add('bi-star-fill');
                }else{
                    starIcon.classList.add('bi-star');
                }
                const deleteIcon = document.createElement('i');
                deleteIcon.classList.add('deleteBtn');
                deleteIcon.classList.add('bi');
                deleteIcon.classList.add('bi-trash3');
                convoOptions.appendChild(starIcon);
                convoOptions.appendChild(deleteIcon);
                    
                convo.appendChild(convoOptions);

                convoLink.addEventListener('click', () => {
                    currentConvoId = convoLink.getAttribute('data-conversation-id');
                    loadConversation();
                });
            });
            const saveBtn = document.querySelectorAll('.saveBtn');
            const deleteBtn = document.querySelectorAll('.deleteBtn');
            saveBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    const requestData = {
                        userId: userId,
                        conversationId: btn.parentElement.parentElement.firstElementChild.getAttribute('data-conversation-id')
                    };
                    if (btn.classList.contains('bi-star')){
                        $.ajax({
                            url: '/api/user/saveConversation',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(requestData),
                            success: function(response) {
                                console.log('Conversation saved successfully:', response);
                                btn.classList.remove('bi-star');
                                btn.classList.add('bi-star-fill');
                            },
                            error: function(xhr, status, error) {
                                console.error('Error saving conversation:', error);
                            }
                        });
                    }else{
                        $.ajax({
                            url: '/api/user/unsaveConversation',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify(requestData),
                            success: function(response) {
                                console.log('Conversation unsaved successfully:', response);
                                btn.classList.remove('bi-star-fill');
                                btn.classList.add('bi-star');
                            },
                            error: function(xhr, status, error) {
                                console.error('Error unsaving conversation:', error);
                            }
                        });
                    }
                });
            });
            
            deleteBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    btn.parentElement.parentElement.remove();
                    deleteConversation(btn.parentElement.parentElement.firstElementChild.getAttribute('data-conversation-id'));
                });
            });
        },
        error: function(xhr, status, error) {
            console.error('Error fetching conversations:', error);
        }
    });
}

function loadConversation(){
    $.ajax({
        url: '/api/language/getAllChats?'+currentConvoId,
        type: 'GET',
        data: { conversationId: currentConvoId },
        success: function(chats) {
            console.log('Chats:', chats);
            let currentSide = "right"

            while (chatContainer.firstChild) {
                if (chatContainer.firstChild === loadingResponse) {
                    chatContainer.innerHTML = '';
                    chatContainer.appendChild(loadingResponse);
                    break;
                }
                chatContainer.removeChild(chatContainer.firstChild);
            }

            chats.forEach(function(chat) {
                const chatDiv = document.createElement('div');
                chatDiv.classList.add('chat');
                chatDiv.classList.add(currentSide);
                const chatText = document.createElement('p');
                chatText.textContent = chat.message;
                const img = document.createElement('img');
                img.alt = 'user';
                img.classList.add('user');
                if (currentSide === "right") { 
                    img.src = imgContent.src;
                }
                else {
                    img.src = '../media/icons/genies.png';
                    img.classList.add('bot');
                }
                chatDiv.appendChild(chatText);
                chatDiv.appendChild(img);
                chatContainer.appendChild(chatDiv);
                currentSide = currentSide === "right" ? "left" : "right";
            });
            chatContainer.scrollTop = chatContainer.scrollHeight;
        },
        error: function(xhr, status, error) {
            console.error('Error fetching chats:', error);
        }
    });
}

function addMessageToConversation(conversationId, message){
    $.ajax({
        url: '/api/language/addChat',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ conversationId, message }),
        success: function(response) {
            console.log('Chat added successfully:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error adding chat:', error);
        }
    });
}

function sendChat(message){
    console.log("Prompt count phase Reached")
    $.ajax({
        url: '/api/user/incrementPromptCount',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ userId: userId }),
        success: function(response) {
            console.log('Prompt count incremented successfully:', response);
        },
        error: function(xhr, status, error) {
            console.error('Error incrementing prompt count:', error);
        }
    });

    if (document.querySelector('.welcomeHolder')) {
        chatContainer.removeChild(welcomeHolder);
        chatContainer.removeChild(suggestionHolder);

        const activityData = {
            userId: userId,
            action: "Language conversation created"
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
        const generatedTitleData = {
            prompt: message
        };

        $.ajax({
            url: '/api/language/getConversationTitle',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(generatedTitleData),
            success: function(response) {
                console.log('Conversation title generated successfully:', response);
                const data = {
                    userId: userId,
                    title: response.choices[0].text,
                    saved: false
                };
                console.log('Data:', data.title);
                $.ajax({
                    url: '/api/language/createConversation',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    success: function(response) {
                        console.log('Success:', response);
                        currentConvoId = response.conversationId;
                        
                        //User response
                        const inputValue = message;
                        const chat = document.createElement('div');
                        chat.classList.add('chat');
                        chat.classList.add('right');
                        const chatText = document.createElement('p');
                        const img = document.createElement('img');
                        img.src = imgContent.src;
                        img.alt = 'user';
                        img.classList.add('user');
                        chatText.textContent = inputValue;
                        chat.appendChild(chatText);
                        chat.appendChild(img);
                        chatContainer.appendChild(chat);
                        addMessageToConversation(currentConvoId, message);
                        //Ai response
                        loadingResponse.style.display = 'flex';
                        chatContainer.removeChild(loadingResponse);
                        chatContainer.appendChild(loadingResponse);
                        //Get AI response
                        $.ajax({
                            url: '/api/language/getResponse',
                            type: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ prompt: message }),
                            success: function(response) {
                                loadingResponse.style.display = 'none';
                                typing = true;
                                const responseText = response.choices[0].text;
                                console.log('AI response:', response);
                                const botChat = document.createElement('div');
                                botChat.classList.add('chat');
                                botChat.classList.add('left');
                                const botChatText = document.createElement('p');
                                const botImg = document.createElement('img');
                                botImg.src = '../media/icons/genies.png';
                                botImg.alt = 'bot';
                                botImg.classList.add('bot');
                                botChat.appendChild(botChatText);
                                botChat.appendChild(botImg);
                                chatContainer.appendChild(botChat);
                                
                                gsap.to(botChatText, {
                                    duration: 1,
                                    text: responseText,
                                    onComplete: () => {
                                        typing = false;
                                    }
                                });
                                setInterval(() => {
                                    if (typing){
                                        chatContainer.scrollTop = chatContainer.scrollHeight;
                                    }
        
                                }, 200);
                                addMessageToConversation(currentConvoId, responseText);
                                //append new conversation to verticalBar
                                const convo = document.createElement('div');
                                convo.classList.add('conversation');
                                //Anchor
                                const convoLink = document.createElement('a');
                                convoLink.setAttribute('data-conversation-id', currentConvoId);
                                convoLink.textContent = data.title;
                                convo.appendChild(convoLink);
                                verticalBar.appendChild(convo);
                                //Options
                                const convoOptions = document.createElement('div');
                                convoOptions.classList.add('convMenu');
                                //Icons
                                const starIcon = document.createElement('i');
                                starIcon.classList.add('saveBtn');
                                starIcon.classList.add('bi');
                                starIcon.classList.add('bi-star');
                                const deleteIcon = document.createElement('i');
                                deleteIcon.classList.add('deleteBtn');
                                deleteIcon.classList.add('bi');
                                deleteIcon.classList.add('bi-trash3');
                                convoOptions.appendChild(starIcon);
                                convoOptions.appendChild(deleteIcon);
                                convo.appendChild(convoOptions);
                                convoLink.addEventListener('click', () => {
                                    currentConvoId = convoLink.getAttribute('data-conversation-id');
                                    loadConversation();
                                });

                                verticalBar.appendChild(convo);
                                if (menuState) {
                                    gsap.to(convo,{
                                        duration: 0.5,
                                        opacity: 1
                                    });
                                }

                                
                                starIcon.addEventListener('click', () => {
                                    const requestData = {
                                        userId: userId,
                                        conversationId: convoLink.getAttribute('data-conversation-id')
                                    };
                                    if (starIcon.classList.contains('bi-star')){
                                        $.ajax({
                                            url: '/api/user/saveConversation',
                                            type: 'POST',
                                            contentType: 'application/json',
                                            data: JSON.stringify(requestData),
                                            success: function(response) {
                                                console.log('Conversation saved successfully:', response);
                                                starIcon.classList.remove('bi-star');
                                                starIcon.classList.add('bi-star-fill');
                                            },
                                            error: function(xhr, status, error) {
                                                console.error('Error saving conversation:', error);
                                            }
                                        });
                                    }else{
                                        $.ajax({
                                            url: '/api/user/unsaveConversation',
                                            type: 'POST',
                                            contentType: 'application/json',
                                            data: JSON.stringify(requestData),
                                            success: function(response) {
                                                console.log('Conversation unsaved successfully:', response);
                                                starIcon.classList.remove('bi-star-fill');
                                                starIcon.classList.add('bi-star');
                                            },
                                            error: function(xhr, status, error) {
                                                console.error('Error unsaving conversation:', error);
                                            }
                                        });
                                    }
                                });

                                deleteIcon.addEventListener('click', () => {
                                    convo.remove();
                                    deleteConversation(convoLink.getAttribute('data-conversation-id'));
                                });
                                
                            },
                            error: function(xhr, status, error) {
                                console.error('Error getting AI response:', error);
                            }
                        });
                    },
                    error: function(xhr, status, error) {
                        console.error('Error:', error);
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error generating conversation title:', error);
            }
        });

        languageInput.value = '';
        return;
    }
    //User response
    const inputValue = message;
    const chat = document.createElement('div');
    chat.classList.add('chat');
    chat.classList.add('right');
    const chatText = document.createElement('p');
    const img = document.createElement('img');
    img.src = imgContent.src;
    img.alt = 'user';
    img.classList.add('user');
    chatText.textContent = inputValue;
    chat.appendChild(chatText);
    chat.appendChild(img);
    chatContainer.appendChild(chat);
    addMessageToConversation(currentConvoId, message);
    //Ai response
    loadingResponse.style.display = 'flex';
    chatContainer.removeChild(loadingResponse);
    chatContainer.appendChild(loadingResponse);
    //Get AI response
    $.ajax({
        url: '/api/language/getResponse',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ prompt: message }),
        success: function(response) {
            loadingResponse.style.display = 'none';
            typing = true;
            const responseText = response.choices[0].text;
            console.log('AI response:', response);
            const botChat = document.createElement('div');
            botChat.classList.add('chat');
            botChat.classList.add('left');
            
            //correction
            const botChatText = document.createElement('p');
            botChatText.textContent = responseText;
            botChat.appendChild(botChatText);
            
            const botImg = document.createElement('img');
            botImg.src = '../media/icons/genies.png';
            botImg.alt = 'bot';
            botImg.classList.add('bot');
            botChat.appendChild(botImg);
            chatContainer.appendChild(botChat);
            
            gsap.to(botChatText, {
                duration: 1,
                text: responseText,
                onComplete: () => {
                    typing = false;
                }
            });
            setInterval(() => {
                if (typing){
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }

            }, 200);
            addMessageToConversation(currentConvoId, responseText);
        },
        error: function(xhr, status, error) {
            console.error('Error getting AI response:', error);
        }
    });
    chatContainer.scrollTop = chatContainer.scrollHeight;
    languageInput.value = '';
}

function deleteConversation(convIdDelete){
    $.ajax({
        url: '/api/language/deleteConversation?conversationId=' + convIdDelete,
        type: 'DELETE',
        contentType: 'application/json',
        success: function(response) {
            console.log('Conversation deleted successfully:', response);
            while (chatContainer.firstChild) {
                if (chatContainer.firstChild === loadingResponse) {
                    chatContainer.innerHTML = '';
                    chatContainer.appendChild(loadingResponse);
                    break;
                }
                chatContainer.removeChild(chatContainer.firstChild);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error deleting conversation:', error);
        }
    });
}

