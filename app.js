let app = angular.module('ukr_cities',[]);

let START_LAT = 50.45;
let START_LNG = 30.52;
let START_ZOOM = 12;

function download(text, name, type) {
    var a = document.createElement("a");
    var file = new Blob([text], {type: type});
    a.href = URL.createObjectURL(file);
    a.download = name;
    a.click();
}

let initMap = ({center,zoom})=>
    new google.maps.Map(document.getElementById('map'), {
        zoom,
        center
    });

let setMapCenter = ({map,position})=> map.panTo(position)

let crateMarker = ({map,position})=>
     new google.maps.Marker({
        position: position,
        map: map
    });

let moveMarker = (marker,newPosition)=> marker.setPosition(newPosition)


let mainCtrl = ($scope)=>{


    $scope.saveAll = ()=>  download(JSON.stringify(CITIES), 'cities.json', 'text/plain');
    $scope.saveResults = ()=> download(JSON.stringify($scope.result), 'cities_result.json', 'text/plain');


    $scope.clearSearch = ()=> {
        $scope.search = '';
        $scope.result= [];
    };
    $scope.goToCity = (item)=>{
        if (!$scope.marker)
            $scope.marker = crateMarker({map: $scope.map,position:{lat: item.lat, lng: item.lng}});
        else
            moveMarker($scope.marker,{lat: item.lat, lng: item.lng})
        
        setMapCenter({map:$scope.map,position:{lat: item.lat, lng: item.lng}});

    };

    $scope.goSearch = ()=>{
        if ($scope.search)
           $scope.result =  fuzzaldrinPlus.filter(CITIES, $scope.search, {key:'city',maxResults :200})
        else $scope.result= []

    };
    $scope.map = initMap({center:{lat: START_LAT, lng: START_LNG },zoom:START_ZOOM});



};



app.controller('mainCtrl',mainCtrl);