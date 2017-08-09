<?php

function writeBreadcrums($theId, $theData) {
	if(empty($theId)) {
		throw new Exception('Invalid or empty id to write breadcrums.');
	}

	$aHash = md5($theId);
	$aFile = DATA_DIR . DIRECTORY_SEPARATOR . $aHash . '.breadcrumbs';
	file_put_contents($aFile, serialize($theData));
}

function loadBreadcrums($theId) {
	if(empty($theId)) {
		throw new Exception('Invalid or empty id to load breadcrums.');
	}

	$aHash = md5($theId);
	$aFile = DATA_DIR . DIRECTORY_SEPARATOR . $aHash . '.breadcrumbs';
	$aData = @unserialize(@file_get_contents($aFile));

	return $aData;
}

function loadSyncData($theId) {
	if(empty($theId)) {
		throw new Exception('Invalid or empty id in load sync.');
	}

	$aHash = md5($theId);
	$aSyncData = unserialize(@file_get_contents(DATA_DIR . DIRECTORY_SEPARATOR . $aHash));

	if($aSyncData === false) {
		throw new Exception('Unable to unserialize sync data.');
	}

	return $aSyncData;
}

function writeSyncData($theId, $theData) {
	if(empty($theId)) {
		throw new Exception('Invalid or empty id in write sync.');
	}

	$aHash = md5($theId);
	file_put_contents(DATA_DIR . DIRECTORY_SEPARATOR . $aHash, serialize($theData));
}

function receiveUploadedFile($theId) {
	if(empty($theId)) {
		throw new Exception('Invalid id to receive uploaded file.');
	}

	if(empty($_FILES) || !isset($_FILES['file'])) {
		throw new Exception('Provided file is invalid.');
	}

	$aHash = md5($theId);
	$aTempFile = $_FILES['file']['tmp_name'];
	$aTargetPath = DATA_DIR . DIRECTORY_SEPARATOR;
	$aTargetFile =  $aTargetPath. $aHash . '.pdf';

	$aOk = move_uploaded_file($aTempFile, $aTargetFile);

	if(!$aOk) {
		throw new Exception('Unable to store file.');
	}
}

 ?>
