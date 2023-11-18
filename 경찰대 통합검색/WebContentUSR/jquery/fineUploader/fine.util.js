var uploader = [];
(function($) {
	/** fineUpload util - 전역 함수 추가 : S */
	var opts; 

	$.fine = {
		// FineUploader 컴포넌트 생성
		init : function(i, elemId, options) {
			opts = $.extend({}, $.fine.defaults, options);

			uploader[i] = new qq.FineUploader({
				debug : true,
				autoUpload : false,
				multiple : opts.fileCnt == 1 ? false : true,
				maxConnections : opts.fileCnt,
				element : document.getElementById(elemId),
				request : { // 파일 업로드 요청
					endpoint : opts.fileUrl + "/insert" + opts.fileType + "Data.do",
					params : opts.params,
					customHeaders: { 'X-CSRF-TOKEN': $('meta[name="_csrf"]').attr('content') }
				},
				deleteFile : { // 파일 삭제 요청
					enabled : true,
					method : "post",
					endpoint : opts.fileUrl + "/delete" + opts.fileType + "Data.do",
					forceConfirm : true,
					confirmMessage : $.msg("js.fine.msg.confirm.delete"),
					params : opts.params,
					customHeaders: { 'X-CSRF-TOKEN': $('meta[name="_csrf"]').attr('content') }
				},
				messages : {
					typeError : $.msg("js.fine.msg.typeError"),
					sizeError : $.msg("js.fine.msg.sizeError"),
					defaultResponseError : $.msg("js.fine.msg.resError"),
					tooManyFilesError : $.msg("js.fine.msg.singleFile"),
					unsupportedBrowser : $.msg("js.fine.msg.notBrowser"),
					tooManyItemsError : $.msg("js.fine.msg.manyItems"),
					onLeave : $.msg("js.fine.msg.onLeave")
				},
				callbacks : {
					onSubmitted : function(id, name) {
						$("#" + elemId).find("li[qq-file-id='" + id + "']").children('button[name="qq-down-btn"]').addClass("qq-hide");
					},
					onUpload : function(id, name) {
						if(opts.fileCnt < 10){
							$.blockUI({
								css : {
									border : "none",
									padding : "15px",
									backgroundColor : "",
									"-webkit-border-radius" : "10px",
									"-moz-border-radius" : "10px",
									opacity : 1,
									color : "#fff"
								}
							});
						}
						if (!opts.isUuid) {
							uploader[i].setUuid(id, uploader[i].getName(id));
						}
					},
					onComplete : function(id, name, responseJSON, xhr) {
						if (!opts.isSave) uploader[i].clearStoredFiles();

						if (responseJSON.success) {
							console.log("2" + id);
							$("li[qq-file-id='" + id + "']").children('button[name="qq-down-btn"]').removeClass("qq-hide");
							$("li[qq-file-id='" + id + "']").children('input[name="path"]').val(responseJSON.path);
						}
						if(opts.fileCnt < 10) $.unblockUI();

						if (opts.postUpload) {
							if(responseJSON.fileNm) uploader[i].setName(id, responseJSON.fileNm); // 리턴받은 파일 명이 있다면 파일명 변경.

							var queuedCnt = uploader[i].getUploads({ status : qq.status.QUEUED }).length; // 연결 대기 중
							var uploadingCnt = uploader[i].getUploads({ status : qq.status.UPLOADING }).length; // 업로드 중
							if (queuedCnt + uploadingCnt === 0) {
								var successCnt = uploader[i].getUploads({ status : qq.status.UPLOAD_SUCCESSFUL }).length; // 업로드 성공
								var failCnt = uploader[i].getUploads({ status : qq.status.UPLOAD_FAILED }).length; // 업로드 실패
								fineUploadComplete(i, successCnt, failCnt, responseJSON.code);
							}
						}
					},
					onSubmitDelete : function(id) {
						var qqli = $("li[qq-file-id='" + id + "']");
						var newParams = {
							uuid : uploader[i].getUuid(id),
							name : uploader[i].getName(id),
							path : $("li[qq-file-id='" + id + "']").children('input[name="path"]').val()
						};
						var deleteParams = uploader[i]._deleteFileParamsStore.get(id);
						qq.extend(newParams, deleteParams);
						uploader[i].setDeleteFileParams(newParams);
					},
					onDeleteComplete : function(id, xhr, isError) {
						if (isError) {
							alert($.msg("js.fine.msg.error"));
						} else {
							opts.postDelete && fineDeleteComplete();
						}
					}
				},
				validation : {
					allowedExtensions : opts.fileExt,
					sizeLimit : opts.fileSize,
					itemLimit : 1000
				}
			});
		},

		// 업로드 템플릿 설정
		tpl : function(id) {
			console.log("3" + id)
			document.getElementById(id).innerHTML = 
				'<script type="text/template" id="qq-template">'+
				'    <div class="qq-uploader-selector qq-uploader" qq-drop-area-text="파일을 드래그 하여 추가하세요.">'+
				'    <div class="qq-upload-drop-area-selector qq-upload-drop-area" qq-hide-dropzone>'+
				'        <span class="qq-upload-drop-area-text-selector"></span>'+
				'    </div>'+
				'    <div id="addFileBtn_fineUpload" class="allbox">'+
				'    <span class="fine_span">숨김 안보임</span>'+
				'    <p class="fine_span_ani">전체 파일 진행률 <span>0</span>%</>'+
				'    <div class="buttons fine_plus">'+
				'        <div class="qq-upload-button-selector btn btn-green">'+
				'            <div>'+'<i class="fa fa-file" aria-hidden="true"></i>' + $.msg("js.fine.button.addFile") + '</div>'+
				'        </div>'+
				'    </div>'+
				'    <div class="qq-total-progress-bar-container-selector qq-total-progress-bar-container " style="display:block;">'+
				'    	<div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-total-progress-bar-selector qq-progress-bar qq-total-progress-bar posi_ap" id="ani_valu"></div>'+
				'    </div>'+
				'    </div>'+
				'    <span class="qq-drop-processing-selector qq-drop-processing">'+
				'        <span>Processing dropped files...</span>'+
				'        <span class="qq-drop-processing-spinner-selector qq-drop-processing-spinner"></span>'+
				'    </span>'+
				'    <ul class="qq-upload-list-selector qq-upload-list" aria-live="polite" aria-relevant="additions removals">'+
				'        <li>'+
				'            <div class="qq-progress-bar-container-selector">'+
				'                <div role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" class="qq-progress-bar-selector qq-progress-bar"></div>'+
				'            </div>'+
				'            <span class="qq-upload-spinner-selector qq-upload-spinner"></span>'+
				'            <span class="qq-upload-file-selector qq-upload-file"></span>'+
				'            <span class="qq-edit-filename-icon-selector qq-edit-filename-icon" aria-label="Edit filename"></span>'+
				'            <input class="qq-edit-filename-selector qq-edit-filename" name="fileNm" tabindex="0" type="text">'+
				'            <span class="qq-upload-size-selector qq-upload-size" name="qq-fileSize"></span>'+
				'            <input type="hidden" name="path">'+
				'            <button type="button" class="qq-btn qq-upload-cancel-selector qq-upload-cancel float_r"title="Cancel"><i class="fa fa-times" aria-hidden="true"></i></button>'+
				'            <button type="button" class="qq-btn qq-upload-retry-selector qq-upload-retry float_r" title="Retry"><i class="fa fa-undo" aria-hidden="true"></i></button>'+
				'            <button type="button" name="qq-del-btn" class="qq-btn qq-upload-delete-selector qq-upload-delete float_r" title="Delete"><i class="fa fa-trash-o" aria-hidden="true"></i></button>'+
				'            <button type="button" name="qq-down-btn" class="qq-btn qq-upload-down-selector qq-upload-download float_r"  title="Download" onclick="javascript:$.fine.download(this);"><i class="fa fa-download" aria-hidden="true"></i></button>'+
				'            <span role="status" class="qq-upload-status-text-selector qq-upload-status-text"></span>'+
				'        </li>'+
				'    </ul>'+
				'    <dialog class="qq-alert-dialog-selector">'+
				'        <div class="qq-dialog-message-selector"></div>'+
				'        <div class="qq-dialog-buttons">'+
				'            <button type="button" class="qq-cancel-button-selector">Close</button>'+
				'        </div>'+
				'    </dialog>'+
				'    <dialog class="qq-confirm-dialog-selector">'+
				'        <div class="qq-dialog-message-selector"></div>'+
				'        <div class="qq-dialog-buttons">'+
				'            <button type="button" class="qq-ok-button-selector">' + $.msg("js.fine.button.confirm") + '</button>'+
				'            <button type="button" class="qq-cancel-button-selector">' + $.msg("js.fine.button.cancel") + '</button>'+
				'        </div>'+
				'    </dialog>'+
				'    <dialog class="qq-prompt-dialog-selector">'+
				'        <div class="qq-dialog-message-selector"></div>'+
				'        <input type="text">'+
				'        <div class="qq-dialog-buttons">'+
				'            <button type="button" class="qq-ok-button-selector">' + $.msg("js.fine.button.confirm") + '</button>'+
				'            <button type="button" class="qq-cancel-button-selector">' + $.msg("js.fine.button.cancel") + '</button>'+
				'        </div>'+
				'    </dialog>'+
				'</script>'
		},

		// 기존 파일 설정
		setFile : function(fileList, startIndex) {
			fileList = fileList.replace(/\r\n/g, "_");
			fileList = fileList.replace(/\\/gi, "/");
			var jsonArr = JSON.parse(fileList);
			startIndex = parseInt(startIndex);

			for (var i = 0; i < jsonArr.length; i++) {
				if (jsonArr[i].length > 0) {
					if (jsonArr[i][0].name != "") {
						uploader[i + startIndex].addInitialFiles(jsonArr[i]);
						var uploadCnt = uploader[i + startIndex].getUploads({ status : qq.status.UPLOAD_SUCCESSFUL }).length;
						var uploaderEl = uploader[i + startIndex]._options.element;
						if (uploadCnt > 0) {
							for (var j = 0; j < jsonArr[i].length; j++) {
								var jsonObject = jsonArr[i][j];
								if (jsonObject.size == "" || jsonObject.size == null) {
									$(uploaderEl).find("li[qq-file-id='" + j + "']").children('span[name="qq-fileSize"]').addClass("qq-hide");
									$(uploaderEl).find("li[qq-file-id='" + j + "']").children('input[name="path"]').val(jsonObject.path);
									if (!opts.isBtn) {
										$(uploaderEl).find("div#addFileBtn_fineUpload").addClass("qq-hide");
										$(uploaderEl).find("li[qq-file-id='" + j + "']").children('button[name="qq-del-btn"]').addClass("qq-hide");
									}if(!opts.isSaveBtn) {
										$(uploaderEl).find("div#addFileBtn_fineUpload").addClass("qq-hide");
										$(uploaderEl).find("li[qq-file-id='" + j + "']").children('button[name="qq-down-btn"]').addClass("qq-hide");
									}if(!opts.isPlusBtn) {
										$(uploaderEl).find("div#addFileBtn_fineUpload").addClass("qq-hide");
										$(uploaderEl).find("div#addFileBtn_fineUpload").children("div.fine_plus").addClass("qq-hide");
									}
								}
							}
						}
					}
				}
			}
		},

		// 파라미터 설정
		setParam : function(i, obj) {
			uploader[i].setParams(obj);
			uploader[i].setDeleteFileParams(obj);
		},

		// 유효성 검사
		validate : function(startIndex) {
			var isValid = true;
			startIndex = parseInt(startIndex);
			$(uploader).each(function(i) {
				if(i >= startIndex){ // 유효성검사 시작 번호보다 큰 경우 체크
					var uploadCnt = uploader[i].getUploads({ status : qq.status.SUBMITTED }).length;
					var successCnt = uploader[i].getUploads({ status : qq.status.UPLOAD_SUCCESSFUL }).length;
	
					if(opts.fileCnt == 1) { // 파일 설정이 1개일때 제출할 파일 수 와 제출 완료된 파일 수가 모두 0일때 Validation 처리 
						if (uploadCnt == 0 && successCnt == 0) isValid =false;
					} else {
						if (uploadCnt == 0) isValid =false;
					}
				}
			});
			if (!isValid) {
				$("div.val-check-area").html("<div id='fileValidation-error' class='error'>" + $.msg("js.fine.msg.notExist") + "</div>");
				throw "upload validation stopped.";
			} else {
				$("div.val-check-area").html("");
			}
		},

		// 파일 업로드
		upload : function(i) {
			var fileCnt = uploader[i].getUploads({ status : qq.status.SUBMITTED }).length;
			if (fileCnt > 0) uploader[i].uploadStoredFiles();
			return fileCnt;
		},

		// 파일 다운로드
		download : function(obj) {
			var id = $(obj).closest('div[id^="fine-uploader"]').attr("id");
			var i = Number(id.substr(13) - 1);
			uuid = uploader[i].getUuid($(obj).closest("li").attr("qq-file-id"));
			name = uploader[i].getName($(obj).closest("li").attr("qq-file-id"));
			var path = $(obj).closest("li").children('input[name="path"]').val();
			path = path.replace(/\\\\/gi, '/'); // 역슬래쉬 두개를 슬래쉬 한개로 변환
			if (!opts.isUuid) uuid = name;
			location.href = "/coms/comsFileDownLoad.do?uuid=" + uuid + "&name=" + name + "&path=" + path;
		}
	}

	// fineUpload 초기 옵션 설정
	$.fine.defaults = {
		isUuid : true, // 고유 시퀀스(uuid) 사용 여부
		isSave : true, // 파일 저장 여부
		isBtn : true, // 추가/삭제 버튼 사용 여부
		postUpload : true, // 파일 업로드 후 callback 함수 사용 여부
		postDelete : true, // 파일 삭제 후 callback 함수 사용 여부
		fileUrl : "", // 실제 파일 관련 작업을 처리할 URL
		fileType : "File", // 업로드 방식 (파일 : File, 엑셀 : Excel)
		fileSize : "100000000", // 최대 용량 (1e+8 Byte = 100MB)
		fileCnt : 1, // 최대 업로드 파일 수 (기본 : 1)
		fileExt : [], // 허용 파일 확장자 (기본 : 제한 없음)
		params : [] // 추가 파라미터 (기본 : 없음)
	}
	/** fineUpload util - 전역 함수 추가 : E */
}(jQuery));
