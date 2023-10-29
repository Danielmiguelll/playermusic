const songs = [];
let isShuffle = false;

document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const playlist = document.getElementById('playlist');
    const songTitle = document.getElementById('song-title');
    const artist = document.getElementById('artist');
    const vinyl = document.getElementById('vinyl');
    const progress = document.querySelector('.progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const trackElements = playlist.getElementsByTagName('li');
    const sortSelect = document.getElementById('sort-select');
    for (let i = 0; i < trackElements.length; i++) {
        const trackElement = trackElements[i];
        const trackNumber = i + 1; 
        const trackTitle = trackElement.textContent;
        trackElement.textContent = trackNumber + '. ' + trackTitle;
    }
    sortSelect.addEventListener('change', function() {
        const selectedOption = sortSelect.value;
        
        if (selectedOption === 'alphabetical') {
            sortAlphabetically();
        } else if (selectedOption === 'date-added') {
            sortByDateAdded();
        }
    });
    
    // Funções de ordenação
    function sortAlphabetically() {
        songs.sort((a, b) => a.title.localeCompare(b.title));
        createPlaylist(); // Atualiza a lista de reprodução com a nova ordem
    }
    
    function sortByDateAdded() {
        songs.sort((a, b) => a.dateAdded - b.dateAdded);
        createPlaylist(); // Atualiza a lista de reprodução com a nova ordem
    }

    let currentSongIndex = 0;
    let isPlaying = false;
   

    function loadSong(index) {
        const song = songs[index];
        audio.src = song.source;    
        songTitle.textContent = song.title;
        artist.textContent = song.artist;
    }
    

    function playPause() {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            vinyl.style.animationPlayState = 'paused';
            playPauseBtn.textContent = '▶';
        } else {
            audio.play();
            isPlaying = true;
            vinyl.style.animationPlayState = 'running';
            playPauseBtn.textContent = '❚❚';
        }
    }

    function updateProgressBar() {
        const currentTime = formatTime(audio.currentTime);
        const totalTime = formatTime(audio.duration);
        const percentage = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = percentage + '%';
        currentTimeDisplay.textContent = currentTime;
        totalTimeDisplay.textContent = totalTime;
    }

    
    function nextSong() {
        if (isShuffle) {
            // Reproduz uma música aleatória se a alternância estiver ativada
            currentSongIndex = getRandomSongIndex();
        } else {
            // Reproduz a próxima música na ordem normal
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
    
        loadSong(currentSongIndex);
        playPause();
        playPause();
        audio.addEventListener('ended', () => {
            nextSong();
        });
        
    }
    
    function getRandomSongIndex() {
        // Gere um índice aleatório entre 0 e o número de músicas na lista
        return Math.floor(Math.random() * songs.length);
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playPause();
        playPause();
    }

    audio.addEventListener('timeupdate', updateProgressBar);
    audio.addEventListener('ended', nextSong);
    playPauseBtn.addEventListener('click', playPause);
    nextBtn.addEventListener('click', nextSong);
    prevBtn.addEventListener('click', prevSong);

    playlist.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const index = [...playlist.children].indexOf(event.target);
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playPause();
            playPause();
        }
    });

 
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (event) => {
        const selectedFiles = event.target.files;
    
        if (selectedFiles.length > 0) {
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
    
                const newSong = {
                    title: file.name.replace(/\.[^/.]+$/, ""),
                    artist: 'Unknown Artist',
                    source: URL.createObjectURL(file),
                };
    
                songs.push(newSong);
    
                const newSongItem = document.createElement('li');
                newSongItem.textContent = newSong.title;
                playlist.appendChild(newSongItem);
    
                // Atualiza a lista de músicas e carrega a nova música apenas se não estiver tocando
                if (!isPlaying && i === 0) {
                    currentSongIndex = songs.length - 1;
                    loadSong(currentSongIndex);
                    playPause();
                }
            }
        }
    });
    

    //evento de clique na barra de progresso
    progress.addEventListener('click', (event) => {
        const clickX = event.clientX - progress.getBoundingClientRect().left;
        const progressWidth = progress.offsetWidth;
        const newTime = (clickX / progressWidth) * audio.duration;
        audio.currentTime = newTime;
    });
});

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function createPlaylist() {
    const playlist = document.getElementById('playlist');
    
    // Limpar a lista de reprodução para evitar duplicatas
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const newSongItem = document.createElement('li');
        const songTitle = document.createElement('span');
        songTitle.className = 'song-title';
        
        // Exibir a numeração separadamente (fora do título da música)
        const trackNumber = document.createElement('span');
        trackNumber.textContent = (index + 1) + '. ';
        
        // Exibir o título da música
        const titleText = document.createTextNode(song.title);
        
        // Anexar a numeração e o título ao elemento li
        newSongItem.appendChild(trackNumber);
        newSongItem.appendChild(titleText);
        
        playlist.appendChild(newSongItem);
    
        newSongItem.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playPause();
        });
    });
}
const shuffleBtn = document.getElementById('shuffle-btn');

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle; // Alternar entre reprodução normal e aleatória

        if (isShuffle) {
            shuffleBtn.classList.add('active'); //  classe 'active' para indicar que a alternância está ativada
        } else {
            shuffleBtn.classList.remove('active'); // Remover a classe 'active' para indicar que a alternância está desativada
        }
    });
      function customCompare(a, b) {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        const hasSpecialOrNumberA = /[0-9~`!@#$%^&*()_+=\-[\]\\';,./{}|":<>?]/.test(titleA);
        const hasSpecialOrNumberB = /[0-9~`!@#$%^&*()_+=\-[\]\\';,./{}|":<>?]/.test(titleB);
    
        if (hasSpecialOrNumberA && !hasSpecialOrNumberB) {
            return 1;
        } else if (!hasSpecialOrNumberA && hasSpecialOrNumberB) {
            return -1;
        }
    
        return titleA.localeCompare(titleB);
    }
    
    // Usar a função de comparação personalizada para ordenar as músicas
    songs.sort(customCompare);
    
    // Criar a lista de reprodução
    createPlaylist();
      
      
      
  