//back to top, footer
var listPeople;
var divDetails = document.getElementById('conteiner-open-details');
var counter = document.getElementById('counter');
var listPeopleInPage = document.getElementById('list-elem');
const prev = document.getElementById('previos-elem');
const next = document.getElementById('next-elem');
const onTop = document.getElementById('hover-container');
const footer = document.getElementById('footer-container');
const element = document.getElementById('elements-scheme');

//footer, scrool to top
onTop.addEventListener('click', scrollToTop);
function scrollToTop () {
  window.scrollTo(0, 0);
}
window.onscroll = function() {
	const styleHover = `top: ${window.pageYOffset}px;`;
	if (window.pageYOffset != 0) {
		onTop.style.cssText = styleHover;
		const styleFooter = `bottom: ${-window.pageYOffset}px;`;
		footer.style.cssText = styleFooter;
	} else {
		onTop.style.display = 'none';
		footer.style.bottom = '0px';
	}
}

//load list of names from API and update page, next and previos button
var loadList = function (urlList) {
		listPeople = JSON.parse(window.localStorage.getItem(urlList));
		if(listPeople.next != null) {
			getInformation(listPeople.next);
		}
			for (var i = 0; i < listPeople.results.length; i++) {
				var li = document.createElement('li');
				var name = listPeople.results[i].name;
				li.innerHTML = name.toLowerCase();
				li.setAttribute('name', listPeople.results[i].name);
				li.addEventListener('click', openPersDetails);
				li.classList.add('pack-elem');
				if(!window.localStorage.getItem(listPeople.results[i].name)) {
					window.localStorage[listPeople.results[i].name] = JSON.stringify(listPeople.results[i]);
				}
				li.onmouseenter = function () {
		    	this.style.backgroundColor = '#D3D3D3';
		    	this.style.color = '#FFFFFF';
		    	this.style.boxShadow = '2px 2px 2px #AFEEEE';
		    	this.style.fontSize = '14px';
        };
        li.onmouseleave = function () {
		    	this.style.backgroundColor = 'inherit';
		    	this.style.color = '#191970';
		    	this.style.boxShadow = 'inherit';
		    	this.style.fontSize = '12px';
        };
				listPeopleInPage.appendChild(li);
			}

		if (listPeople.previous != null) {
			prev.setAttribute('href', listPeople.previous);
			prev.style.display = 'block';
		} else {
			prev.removeAttribute('href');
			prev.style.display = 'none';
		}
	
		if (listPeople.next != null) {
			next.setAttribute('href', listPeople.next);
			next.style.display = 'block';
		} else {
			next.removeAttribute('href');
			next.style.display = 'none';
		}

	function countPages () {
		var text = urlList;
		counter.innerHTML = 'page #' + text.replace('https://swapi.co/api/people/?format=json&page=', '');	
	}
	countPages();
	return;
}

// f fo get information API, return Object
var getInformation = function (strUrl) {
	if(!window.localStorage.getItem(strUrl)) {
	  var notSupported = function() {
	    element.innerHTML = 'Ups... Problems with obtaining information. Please, check your connection';
	  };
	  var getJSON = function(url, successHandler, errorHandler) {
	    if (typeof XMLHttpRequest == 'undefined') {
	      return notSupported();
	    }
	    var xhr = new XMLHttpRequest();
	    xhr.open('get', url, true);
	    xhr.responseType = 'json';
	    xhr.onload = function() {
	      var status = xhr.status;
	      if (status === 200) {
	        successHandler && successHandler(xhr.response);
	      } else {
	      errorHandler && errorHandler(status);
	      }
	    };
	    xhr.send();
  };

  getJSON(strUrl, function (data) {
  	if (typeof data == 'string') {
      return notSupported();
    } else {
    	  window.localStorage[strUrl] = JSON.stringify(data);
    }
  }, function () {
  	return notSupported();
  });
}
}

//initial load (in first page)
window.onload = function () {
	var url = 'https://swapi.co/api/people/?format=json&page=1';
	getInformation(url);
	loadList(url);
}

//scroll catalog
prev.onclick = function () {
	listPeopleInPage.innerHTML = '';
	getInformation(prev.getAttribute('href'));
	loadList(prev.getAttribute('href'));
}
next.onclick = function () {
	getInformation(next.getAttribute('href'));
	listPeopleInPage.innerHTML = '';
	loadList(next.getAttribute('href'));
}

//open details
var openPersDetails = function (e) {
	if(divDetails.hasChildNodes()) {
		divDetails.removeChild(divDetails.firstChild);
		divDetails.removeChild(divDetails.lastChild);
		openPersDetails(e);
	} else {
		target = e && e.target || e.srcElement;
		var nameItem = target.getAttribute('name');
		if (typeof nameItem !== undefined) {
			var data = JSON.parse(window.localStorage.getItem(nameItem));
			var ulDetails = document.createElement('ul');
				
				for (var i = 1; i <= 6; i++) {
					switch(i) {
						case 1: 
							var liName = document.createElement('li');
							liName.innerHTML = data.name.toUpperCase();
							liName.style.marginBottom = '10px';
							liName.style.color = '#333333';
							liName.style.backgroundColor = '#FFFFFF';
							ulDetails.appendChild(liName);
							break;
						case 2:
							var liBirthYear = document.createElement('li');
							liBirthYear.innerHTML = 'Birth Year: ' + data.birth_year;
							ulDetails.appendChild(liBirthYear);
							break;
						case 3:
							var liGender = document.createElement('li');
							liGender.innerHTML = 'Gender: ' + data.gender;
							ulDetails.appendChild(liGender);
							break;
						case 4:
							var liFilms = document.createElement('li');
							liFilms.classList.add('container-film-list');
							liFilms.innerHTML = 'Films: ';
							for (var j = 0; j < data.films.length; j++) { 
								var itemFilm = document.createElement('li');
								var getInf = requestDetails(data.films[j]);
								if (typeof getInf !== 'undefined') {
									itemFilm.innerHTML = getInf.title;
									itemFilm.classList.remove('error');
								} else {
									itemFilm.innerHTML = 'need reload';
									itemFilm.classList.add('error');
								}
								itemFilm.classList.add('film-list');
								liFilms.appendChild(itemFilm);
							}
							ulDetails.appendChild(liFilms);
							break;
						case 5:
							var liHomeworld = document.createElement('li');
							var getInf = requestDetails(data.homeworld);
							if (typeof getInf !== 'undefined') {
								liHomeworld.innerHTML = "Homeworld/Planet: " + getInf.name;
								liHomeworld.classList.remove('error');
							} else {
								liHomeworld.innerHTML = "Homeworld/Planet: need reload";
								liHomeworld.classList.add('error');
							}
							ulDetails.appendChild(liHomeworld);
							break;
						case 6:
							var liSpecies = document.createElement('li');
							//second using
							getInf = requestDetails(data.species[0]);
							if (typeof getInf !== 'undefined') {
								liSpecies.innerHTML = 'Species: ' + getInf.name;
								liSpecies.classList.remove('error');
							} else {
								liSpecies.innerHTML = 'Species: need reload';
								liSpecies.classList.add('error');
							}
							ulDetails.appendChild(liSpecies);
							break;
						}
					}
					var forClose = document.createElement('a');
					forClose.innerHTML = "close";
					forClose.classList.add('closer');

					forClose.onclick = function (event) {
						closeDetails(event);
					}

					forClose.onmouseenter = function () {
			    	forClose.classList.add('active');
	        };
	        forClose.onmouseleave = function () {
			    	forClose.classList.remove('active');
	        };

					
					divDetails.appendChild(forClose);
					divDetails.appendChild(ulDetails);
		} else {
			var li = document.createElement('li');
			li.innerHTML = 'Ups... Problems with obtaining information. Please, check your connection';
			target.appendChild(li);
		}
	}
}

function requestDetails (url) {
	var data;
	var urlJson = url + "?format=json";

	if(!window.localStorage.getItem(urlJson)) {
		data = getInformation(urlJson);
		if (typeof data !== 'undefined'){
			data = JSON.parse(data);
			return data;			
		} else {
			return;
		}
	} else {
		data = window.localStorage.getItem(urlJson);
		data = JSON.parse(data);
		return data;
	}
}

//close details
var closeDetails = function (event) {
	t = event.target || event.srcElement;
	var itemClose = t.parentNode;
	if (typeof itemClose !== 'undefined') {
		itemClose.removeChild(itemClose.firstChild);
		itemClose.removeChild(itemClose.lastChild);
	}
};

