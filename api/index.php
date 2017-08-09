<?php

require_once(dirname(__FILE__) . '/config.php');

$aMethod    = isset($_REQUEST['method']) ? $_REQUEST['method'] : '';
$aId        = isset($_REQUEST['id']) ? $_REQUEST['id'] : '';
$aPresenter = isset($_REQUEST['presenter']) ? $_REQUEST['presenter'] : '';
$aReturn    = array('success' => true, 'method' => $aMethod, 'time' => time());

try {
	switch ($aMethod) {
		case 'create':
			$aPresenterId = md5(rand() . 'blah' . time()); // TODO: improve this
			$aPresenterHash = md5($aPresenterId);
			$aViewerId = md5(rand() . $aPresenterHash);
			$aData = array(
				'viewer_id' => $aViewerId
			);

			file_put_contents(DATA_DIR . DIRECTORY_SEPARATOR . $aPresenterHash, serialize($aData));

			$aReturn['data'] = array(
				'viewer_id' => $aViewerId,
				'presenter_id' => $aPresenterId
			);
			break;

		case 'read':
			if($aId == '') {
				throw new Exception('Empty id');
			}
			$aHash = md5($aId);
			$aSyncData = unserialize(@file_get_contents(DATA_DIR . DIRECTORY_SEPARATOR . $aHash));

			if($aSyncData === false) {
				throw new Exception('Something wrong with the unserialize.');
			}

			$aReturn['data'] = $aSyncData;
			break;

		case 'write':
			if($aPresenter == '') {
				throw new Exception('Missing presenter identification.');
			}

			$aPresenterHash = md5($aPresenter);
			$aPresenterData = unserialize(@file_get_contents(DATA_DIR . DIRECTORY_SEPARATOR . $aPresenterHash));

			if($aPresenterData === false) {
				throw new Exception('Unable to load presenter data.');
			}

			$aViewerPackage = array(
				'slide' => isset($_REQUEST['slide']) ? $_REQUEST['slide'] : '1',
				'write_time' => time()
			);

			$aViewerHash = md5($aPresenterData['viewer_id']);
			file_put_contents(DATA_DIR . DIRECTORY_SEPARATOR . $aViewerHash, serialize($aViewerPackage));
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
