'use strict';

//form fields
const titleInput = document.getElementById('title_input');
const linkInput = document.getElementById('link_input');
const descInput = document.getElementById('desc_input');
const topicInput = document.getElementById('topic_input');

//Buttons
const articleBtn = document.getElementById('article_btn');
const deleteBtns = document.getElementsByClassName('deleteBtns');

//Event handlers
const deleteHandler = (e) => {
    fetch(`/api/articles/${e.target.id}`,{
        method: "delete"
    }).then(()=> window.location.replace('/articles'));
};

// const addHandler = (e) => {
// TO DO
// };

//Event listeners
for(let i = 0; i < deleteBtns.length; i++){
    deleteBtns[i].addEventListener('click', deleteHandler);
}


