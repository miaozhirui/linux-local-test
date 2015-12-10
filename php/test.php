<?php
$time = time();
$userId = 110500;
$sing =  md5('alks@djfl#k293$u48%29JSEWI37S89SDxdjw'.$userId.$time);
echo $sing;
echo '<br>';
$auth = base64_encode($sing.':'.$time);
echo $auth;
echo "<br>";



$href = "http://webapitest.ziseyiliao.com/zend-web/app/src/views/service-introduction.html?UserId=".$userId."&AppId=DuDuDoctor&DeviceId=0f1262bd228645a37ec3e54948078352c25cf182&ClientOS=iOS&ChannelType=1&Page=1&auth=".$auth."&QuestionId=418884&DoctorId=918";
echo "<a href='".$href."' target='_blank'>111</a>";