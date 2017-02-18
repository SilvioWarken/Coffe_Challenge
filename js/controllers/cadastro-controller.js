angular.module('coffeChallenge').controller('CadastroController', function($scope, localStorageService){
	
	$scope.cadastroNomes = [];
	$scope.listaSemanal = [];
	$scope.listaManha = [];
	$scope.listaTarde = [];
	$scope.showTable = false;
	$scope.printView= false;
	$scope.gerado = false;
	$scope.localServerOn = false;	

	$scope.activateServer = function(){
		$scope.localServerOn = !$scope.localServerOn;
		if(!localStorageService.isSupported && $scope.localServerOn) {
			alert("Seu sistema não suporta Servidor Local");
			$scope.localServer = false;
		}			
	};

	$scope.cadastrar=function(){
		if (!$scope.verificaDuplicata()){ // verifica se exite outro nome igual cadastrado.
			$scope.cadastroNomes.push($scope.vo.cadastro); 
			$scope.vo.cadastro = " "; // limpar input.
			if($scope.localServerOn){
				localStorageService.set('funcionarios', $scope.cadastroNomes);
			}
			if($scope.gerado){ // se a lista semanal já foi gerada.
				alert ("Novo funcionário adicionado, a lista semanal será atualizada");
				$scope.gerarLista(); 
			}
			
		}
		else{
			alert ("Nome duplicado, tentar outro nome");
		}	
	};

	$scope.verificaDuplicata=function(){
		var encontrado = $scope.cadastroNomes.indexOf($scope.vo.cadastro); // procura nomes iguais e retorna o indice.
		if (encontrado == -1){
			return false;
		}
		else{
			return true;
		}
	};

	$scope.remover=function(nop){
		var indiceNome = $scope.cadastroNomes.indexOf(nop);
		$scope.cadastroNomes.splice(indiceNome, 1); // remove o funcionário da lista.		
		if($scope.gerado){ // se a lista semanal já foi gerada.
			if($scope.cadastroNomes.length == 0){ // se todos os ficar vazio.
				$scope.showTable = false;
				alert("Todos os funcionários foram removidos.Cadastre algum funcionário para gerar uma nova lista.")
				$scope.gerado = false;
			}
			else {
				alert ("Funcionário removido, a lista semanal será atualizada.");
				$scope.gerarLista();
			}
		} 
	};

	$scope.atualizarBanco=function(){
		localStorageService.set('funcionarios', $scope.cadastroNomes); // envia a lista atualizada para o servidor local
	}

	function shuffle(array) {
  		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) { // enquanto restar funcionários a serem alocados.
			randomIndex = Math.floor(Math.random() * currentIndex); // sorteia um entre os que ainda não foram selecionados.
			currentIndex -= 1; 
			temporaryValue = array[currentIndex]; // faz uma cópia do valor do local sorteado.
			array[currentIndex] = array[randomIndex]; // adiciona o funcionário sorteado no ultimo indice do array.
			array[randomIndex] = temporaryValue; // coloca o funcionário original do ultimo indice no lugar do funcionario sorteado
  		}

  		return array;
	}
	$scope.gerarLista=function(){
		if ($scope.cadastroNomes.length > 0 ){
			$scope.listaManha.splice(0,$scope.listaManha.length);  // bloco para resetar todos os
			$scope.listaTarde.splice(0,$scope.listaTarde.length);  // valores usados.
			listaSemanal = angular.copy($scope.cadastroNomes); 
			listaSemanal = shuffle(listaSemanal);
			var filtro = true;
			
			for (var indice = 0; indice < listaSemanal.length && listaSemanal.length <10; indice++){ //se houver menos de 10 funcionarios.
				listaSemanal.push(listaSemanal[indice]); // adiciona os funcionários no array, na ordem que foram sorteados.			
			};

			if (listaSemanal.length > 10){ // se houver mais que 10 funcionários.
				listaSemanal.splice(10,(9-$scope.listaSemanal.length)); // remove os que sobraram.
			};
			for (pessoa in listaSemanal) {
				if (filtro){ // separa os funcionários entre os turnos.
					$scope.listaManha.push(listaSemanal[pessoa]); //adiciona eles nas respectivas listas
				}
				else{
					$scope.listaTarde.push(listaSemanal[pessoa]);
				}
				filtro = !filtro;
			};
			if($scope.localServerOn){ // se o servidor estiver ligado
				localStorageService.set('listaManha', $scope.listaManha); // envia a lista para o servidor
				localStorageService.set('listaTarde', $scope.listaTarde);
			}
			$scope.gerado = true;
			$scope.showTable = true;
		}
		else{
			alert("Não existe funcionários cadastrados. Cadastre algum funcionário antes.")
		}
	};

	$scope.resetarLista = function() {
		listaSemanal.splice(0,listaSemanal.length);
		$scope.listaManha.splice(0,$scope.listaManha.length); // limpa os arrays utilizados no processo
		$scope.listaTarde.splice(0,$scope.listaTarde.length);
		$scope.showTable = false;
		$scope.gerado = false;
	}

	$scope.printData= function()
	{
   		var divToPrint=document.getElementById("printTable"); // busca os elementos marcados para impressão.
   		newWin= window.open("");
   		newWin.document.write(divToPrint.outerHTML); // envia a para impressão.
   		newWin.print();
   		newWin.close();
	}

	$scope.restoreBackup= function()
	{
		if(localStorageService.get('funcionarios').length == 0){ // se não encontrar registros antigos.
			alert("Impossivel fazer backup, não existe registro de funcionarios no backup.");
		}
		else {
			$scope.cadastroNomes = localStorageService.get('funcionarios');
			$scope.listaManha = localStorageService.get('listaManha');
			$scope.listaTarde= localStorageService.get('listaTarde');
			$scope.showTable = true;
			$scope.gerado = true;
		}
	}

	$scope.printVersion=function(){ // altera a view do html para o modo de impressão e vice-versa.
		$scope.printView = !$scope.printView;
		if($scope.printView){ // adapta a tabela semanal para o modo de visualização correto.
			document.getElementById('div_table').setAttribute("style","float: left; width:100%");
		}
		else {
			document.getElementById('div_table').setAttribute("style","float: left; width:100%");
		}
	}

});