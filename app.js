const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist')
const cd = $('.cd');
const heading = $('header h2')
const cdThump = $('.cd-thumb')
const audio = $('#audio')


const player = $('.player') 
const playBtn = $('.btn-toggle-play') //playing

const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')

const progress = $('#progress')

const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')






const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
   
    songs:[
    {
        name: 'Always remember us this way',
        singer: 'Lady Gaga',
        path: './assets/music/AlwaysRememberUsThisWay-LadyGaga.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    },


    
    {
        name: 'Chỉ muốn bên em lúc này',
        singer: 'Jukix & Huy Vạc',
        path: './assets/music/ChiMuonBenEmLucNay-JikixHuyVac.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    },

    {
        name: 'Nàng thơ',
        singer: 'Hoàng Dũng',
        path: './assets/music/NangTho-HoangDung.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    },

    {
        name: 'Thế thái',
        singer: 'Hương Ly',
        path: './assets/music/TheThai-HuongLy.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    },

    {
        name: 'Tình bạn diệu kì',
        singer: 'AMee, Ricky Star & Lăng LD',
        path: './assets/music/TinhBanDieuKy-AMeeRickyStarLangLD.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    },

    {
        name: 'Nhớ người hay nhớ ta',
        singer: 'Khói, Sofia, Châu Đăng Khoa',
        path: './assets/music/NhoNguoiHayNho-KhoiSofiaVietNamChauDangKhoa.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    },

    {
        name: 'Hoa nở không màu',
        singer: 'Hoài Lâm',
        path: './assets/music/HoaNoKhongMau1-HoaiLam.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    },

    {
        name: 'Muốn nói với em',
        singer: 'T-Team',
        path: './assets/music/MuonNoiVoiEm-TTeam.mp3',
        image: './assets/img/AlwaysRememberUsThisWay.jpg'
    }
    ],
    
    render: function(){
        const htmls = this.songs.map((song,index) => {
            return ` 
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        });
    },

    handleEvents: function(){
        const _this = this //_this = app
        const cdWidth = cd.offsetWidth;

        // Xử lí CD quay / dừng
        const cdThumpAnimate =  cdThump.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations: Infinity // lặp lại bao lần?
        })
        cdThumpAnimate.pause();

        // Xử lí phóng to / thu nhỏ CD khi scroll lên xuống
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth;
        }

        //Xử lí khi nhấn nút play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{   
                audio.play();
            }
        }

        //Khi song được play 
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');

            cdThumpAnimate.play();
        }

        //Khi song bị pause
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumpAnimate.pause();
        }

        //Khi song thay đổi theo thời gian
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration /*tổng số s*/ * 100) //làm tròn dưới 
                progress.value = progressPercent;
            }
            
        }

        //Xử lí khi tua Song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Khi next Song
        nextBtn.onclick = function(){
            if(_this.isRandom){ // Nút random bật
                _this.playRandomSong();
            }else {             // Nút random tắt
                _this.nextSong();
            }
            audio.play();
            _this.render(); // mục đích để kích hoạt active cho bài sau
            _this.scrollToActiveSong();
        }

        // Khi Pre Song
        preBtn.onclick = function(){
            if(_this.isRandom){ // Nút random bật
                _this.playRandomSong();
            }else {             // Nút random tắt
                _this.prevSong();
            }
            audio.play();
            _this.render(); // mục đích để kích hoạt active cho bài sau
            _this.scrollToActiveSong();
        }

        // Khi click nút Random Songs
        randomBtn.onclick = function(){  
            if(randomBtn.classList.contains('active')){
                _this.isRandom = false;
                randomBtn.classList.remove('active')
            }else{
                _this.isRandom = true;
                randomBtn.classList.add('active')
            }
        }

        // Khi click nút Repeat
        repeatBtn.onclick = function(){
            if(repeatBtn.classList.contains('active')){
                repeatBtn.classList.remove('active')
                _this.isRepeat = false;
            }else{
                repeatBtn.classList.add('active')
                _this.isRepeat = true;
            }
        }

        // Xử lí next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
            
        }

        // Bấm vào từng bài trong playlist
        playlist.onclick = function(e){
            // Trả về element chính nó hoặc thẻ cha của nó, nếu không sẽ null
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                // Xử lí khi click vào song
                    if(songNode){
                        _this.currentIndex = Number(songNode.dataset.index);
                        _this.loadCurrentSong();
                        audio.play();
                        _this.render();
                    }

                // Xử lí khi click vào option
                    if(e.target.closest('.option')){

                    }
            }
        }
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThump.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
        
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        }
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 200)
    },



    // getCurrentSong: function(){
    //     return this.songs[this.currentIndex];
    // },

    start: function(){ 
        //Định nghĩa các thuộc tính cho object
        this.defineProperties();

        //DOM event (lắng nghe xử lí các sự kiện)
        this.handleEvents();

        //Tải thông tin bài hát đầu tiên vào UI
        this.loadCurrentSong();

        // Render Playlist
        this.render();
    }
}

app.start();



