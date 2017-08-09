<?php

@include_once(dirname(__FILE__) . '/../config.php');
@include_once(dirname(__FILE__) . '/config.php');

require_once(dirname(__FILE__) . '/functions.php');

$aMethod    = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';
$aId        = isset($_REQUEST['id']) ? $_REQUEST['id'] : '';
$aPresenter = isset($_REQUEST['presenter']) ? $_REQUEST['presenter'] : '';
$aReturn    = array('success' => true, 'method' => $aMethod, 'time' => time());

try {
	switch ($aMethod) {
		case 'content':
			if($aId == '') {
				throw new Exception('Empty presentation id.');
			}
			$aHash = md5($aId);
			$aPresentationFile = DATA_DIR . DIRECTORY_SEPARATOR . $aHash . '.pdf';

			if(!file_exists($aPresentationFile)) {
				throw new Exception('Could not load presentation file.');
			}

			$aFile = fopen($aPresentationFile, 'rb');
			header('Content-Type: application/pdf');
			fpassthru($aFile);
			fclose($aFile);
			exit();

			break;

		case 'create':
			$aPresenterId = md5(rand() . 'blah' . time()); // TODO: improve this
			$aViewerId    = md5(rand() . $aPresenterId . time());

			receiveUploadedFile($aViewerId);

			writeSyncData($aPresenterId, array(
				'viewer_id' => $aViewerId
			));

			$aReturn['data'] = array(
				'viewer_id'    => $aViewerId,
				'presenter_id' => $aPresenterId
			);
			break;

		case 'read':
			$aReturn['data'] = loadSyncData($aId);
			writeBreadcrums($aId, array('last_read' => time()));
			break;

		case 'write':
			$aSlide = isset($_REQUEST['slide']) ? $_REQUEST['slide'] : '1';
			$aPresenterData = loadSyncData($aPresenter);

			writeSyncData($aPresenterData['viewer_id'], array(
				'slide' 	 => $aSlide,
				'write_time' => time()
			));
			break;

		default:
			$aReturn = array('failure' => true, 'message' => 'Unknow method');
			break;
	}
} catch(Exception $e) {
	$aReturn = array('failure' => true, 'message' => $e->getMessage());
}

header('Content-Type: application/json');
echo json_encode($aReturn, JSON_NUMERIC_CHECK);

?>
