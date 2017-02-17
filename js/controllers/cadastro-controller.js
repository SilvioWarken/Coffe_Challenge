angular.module('coffeChallenge').controller('CadastroController', function($scope){
	
	$scope.cadastroNomes = [];
	$scope.listaSemanal = [];
	$scope.listaManha = [];
	$scope.listaTarde = [];
	$scope.showTable = false;
	$scope.printView= false;
	$scope.gerado = false;

	$scope.cadastrar=function(){

		if (!$scope.verificaDuplicata()){
			$scope.cadastroNomes.push($scope.vo.cadastro); //{"nome":$scope.vo.cadastro,"count":"0"}
			$scope.vo.cadastro = " ";
		}
		else{
			alert ("Nome duplicado, tentar outro nome");
		}	
		if($scope.gerado){
			alert ("Novo funcionário, a lista semanal será atualizada");
			$scope.gerarLista();
		}
	};

	$scope.verificaDuplicata=function(){
		var encontrado = $scope.cadastroNomes.indexOf($scope.vo.cadastro);
		if (encontrado == -1){
			return false;
		}
		else{
			return true;
		}
	}

	$scope.remover=function(nop){
		var indiceNome = $scope.cadastroNomes.indexOf(nop);
		$scope.cadastroNomes.splice(indiceNome, 1);
		if($scope.gerado){
			if($scope.cadastroNomes.length == 0){
				$scope.showTable = false;
				alert("Todos os funcionários foram removidos.Cadastre algum funcionário para gerar uma nova lista.")
				$scope.gerado = false;
			}
			else {
				alert ("Funcionário removido, a lista semanal será atualizada");
				$scope.gerarLista();
			}
		} 
	};

	function shuffle(array) {
  		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
  		}

  		return array;
	}
	$scope.gerarLista=function(){
		if ($scope.cadastroNomes.length > 0 ){
			$scope.listaManha.splice(0,$scope.listaManha.length);
			$scope.listaTarde.splice(0,$scope.listaTarde.length);
			listaSemanal = angular.copy($scope.cadastroNomes);
			listaSemanal = shuffle(listaSemanal);
			var filtro = true;
			
			for (var indice = 0; indice < listaSemanal.length && listaSemanal.length <10; indice++){
				listaSemanal.push(listaSemanal[indice]);			
			};

			if (listaSemanal.length > 10){
				listaSemanal.splice(10,(9-$scope.listaSemanal.length));
			};
			for (pessoa in listaSemanal) {
				if (filtro){
					$scope.listaManha.push(listaSemanal[pessoa]);
				}
				else{
					$scope.listaTarde.push(listaSemanal[pessoa]);
				}
				filtro = !filtro;
			};
			$scope.gerado = true;
			$scope.showTable = true;
		}
		else{
			alert("Não existe funcionários cadastrados. Cadastre algum funcionário antes.")
		}
	};

	$scope.resetarLista = function() {
		$scope.listaSemanal.splice(0,$scope.listaSemanal.length);
		$scope.listaManha.splice(0,$scope.listaManha.length);
		$scope.listaTarde.splice(0,$scope.listaTarde.length);
		$scope.showTable = false;
		$scope.gerado = false;
	}

	$scope.printData= function()
	{
   		var divToPrint=document.getElementById("printTable");
   		newWin= window.open("");
   		newWin.document.write(divToPrint.outerHTML);
   		newWin.print();
   		newWin.close();
	}

	$scope.printVersion=function(){
		$scope.printView = !$scope.printView;
		if($scope.printView){
			document.getElementById('div_table').setAttribute("style","float: left; width:100%");
			//$scope.printView = true;
		}
		else {
			document.getElementById('div_table').setAttribute("style","float: left; width:100%");
			//$scope.printView = false;
		}
		//$scope.printView = !$scope.printView;
	}

});