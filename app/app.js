var config = {
	apiKey: "AIzaSyCuTA2vlq5tYnXZDp3xzFU2RJnB82UAMP8",
	authDomain: "justiceforall-20ea4.firebaseapp.com",
	databaseURL: "https://justiceforall-20ea4.firebaseio.com",
	projectId: "justiceforall-20ea4",
	storageBucket: "justiceforall-20ea4.appspot.com",
	messagingSenderId: "198207540663",
	appId: "1:198207540663:web:dbd608a5566cb231"
};
firebase.initializeApp(config);

angular.module('jus', ['firebase', 'ngRoute'])
    .factory('articles', function ($q, $firebaseArray, $firebaseObject) {
        return {
            getContentsLimit: () => $q((resolve, reject) => {
                $firebaseArray(
                    firebase.database().ref().child("contentManager/public/")
                        .orderByKey().limitToLast(10)).$loaded((data) => {
                            if (data) {
                                resolve(data);
                            } else {
                                reject("Error load Data");
                            }
                        });
            }),
            getContent: (key) => $q((resolve, reject) => {
                $firebaseObject(
                    firebase.database().ref().child("contentManager/all/" + key))
                        .$loaded((data) => {
                            if (data) {
                                resolve(data);
                            } else {
                                reject("Error load Data");
                            }
                        });
            })
        }
    })
    .factory('images', function ($q) {
        return (name) => $q((resolve, reject) => {
            var downloadTask = firebase.storage().ref().child(name);
            downloadTask.getDownloadURL().then(function (url) {
                resolve(url);
            }).catch(function (error) {
                reject(error);
            });
        });
    })
    .factory('assignImage', ($q, images) => {
        return (articlesList) => $q((resolve, reject) => {
            var result = [];
            var arrayPromises = [];
            angular.forEach(articlesList, function (value) {
                if (value.typeTemplate == 1 || value.typeTemplate == 3)
                    arrayPromises.push(
                        images(value.$id + ".png")
                            .then((imageUrl) => {
                                value.image = imageUrl;
                                result.push(value);
                            })
                            .catch((error) => {
                                throw (error);
                            })
                    );
                else result.push(value);
            });
            $q.all(arrayPromises)
                .then(() => {
                    resolve(result);
                })
                .catch((error) => {
                    reject(error);
                });
        })
    })
    .controller('loadArticles', function (articles, assignImage, $location) {
        var vm = this;
        setTimeout(()=>{
            document.getElementById("ftco-loader-two").style.display = "none"
            document.getElementById("articles").style.display = ""
        }, 7000)
        vm.items = [];

        vm.returnImageFromYoutube = function(id){
            return `https://img.youtube.com/vi/${id}/2.jpg`
        }
        articles.getContentsLimit()
            .then((data) => {
                if (data.length != 0)
                    return assignImage(data);
                return [];
            })
            .then((data) => {
                vm.items = data;
            });

        vm.goArticle = (id, title) => {
            newTitle = title.replace(/ /gi, "-");
            window.location = `article.html?id=${id}?title=${newTitle}`
        };
    })
    .controller('articleCtrl', function ($sce, articles, images, $routeParams) {
        var vm = this;
        var a = location.search
        var id = a.substring(4,a.lastIndexOf("?"))
        articles.getContent(id)
        .then((article) => {
            vm.article = article;
            vm.article.template.texto = $sce.trustAsHtml(article.template.texto);
            vm.article.video = $sce.trustAsResourceUrl("https://www.youtube.com/embed/"+article.video);
            if(vm.article.typeTemplate==1 || vm.article.typeTemplate==3)
                images(id + ".png")
                    .then((imageUrl) => {
                        vm.image = imageUrl;
                    })
        });
    }); 