new Vue({
	el: '#app',
	data: {
		songsList: [],
		genres: [],
		audioSrc: '',
		selectedGenre: '',
		selectedSong: '',
		songs: [],
		isRecording: false,
		isPlaying: false,
		audio: []

	},
	methods: {
		play() {
			if(this.selectedSong != '') {
				this.audioSrc = `./media/${this.selectedSong}.mp3`;
				this.isPlaying = true;
			}
		},
		pause() {
			if(this.isPlaying == true) {
				var music = document.getElementById('music');
				if(music.paused) {
					music.play();
				} else {
					music.pause();
				}
			}
		},
		stop() {
			let myAudio = this;
			if(myAudio.isRecording == true) {
				myAudio.isRecording = false;
				myAudio.mediaRecorder.stop();
				var blob = new Blob(myAudio.audio, {
	        'type': 'audio/ogg; codecs=opus'
	      });
	      myAudio.audio = [];
	      var audioURL = window.URL.createObjectURL(blob);
	      myAudio.audioSrc = audioURL;
	    } else if(myAudio.isPlaying == true) {
	    	myAudio.audioSrc = '';
	    	myAudio.isPlaying = false;
	    }
		},
		rewind() {
			console.log('Song has rewinded by 10sec');
			if(this.isPlaying == true) {
				var songsList = document.getElementById('songs');
				var selectedSong = songsList.selectedIndex;
				if(selectedSong < songsList.length) {
					this.selectedSong = songsList.options[selectedSong - 1].value;
				}
				this.audioSrc = `./media/${this.selectedSong}.mp3`;
			}
		},
		forward() {
			if(this.isPlaying == true) {
				var songsList = document.getElementById('songs');
				var selectedSong = songsList.selectedIndex;
				if(selectedSong < songsList.length) {
					this.selectedSong = songsList.options[selectedSong + 1].value;
				}
				this.audioSrc = `./media/${this.selectedSong}.mp3`;
			}
		},
		record() {
			let myAudio = this;
			myAudio.isRecording = true;
			var constraints = {audio:true};
			navigator.mediaDevices.getUserMedia(constraints)
			.then(function(mediaStream) {
			  var mediaRecorder = new MediaRecorder(mediaStream);
			  myAudio.mediaRecorder = mediaRecorder;
			  mediaRecorder.start(10000);
			  mediaRecorder.ondataavailable = function(e) {
			  	console.log(e);
				  myAudio.audio.push(e.data);
				}
			})
			.catch(function(err) { console.log(err.name + ": " + err.message); });
		}
	},
	watch: {
		isRecording: function() {
			console.log(this.isRecording);
			console.log(this.audio);
		},
		selectedGenre: function() {
			this.songs = [];
			for(var song of this.songsList) {
				if(song.genre === this.selectedGenre) {
					this.songs.push(song.title);
				}
			}
		}
	}
});