
var transformPanel = new YAHOO.widget.Panel("transform",
	{ width: "800px",
	 height: "400px",
	  fixedcenter: true,
	  constraintoviewport: true,
	  close: true,
	  draggable: true,
	  zindex: 4,
	  modal: true,
	  visible: false
	}
);

transformPanel.setHeader("Transform items for import");
transformPanel.setBody("<center>Loading...<br/><img src=\"images/rel_interstitial_loading.gif\"/></center>");
transformPanel.hideEvent.subscribe(transformPanelClose); 

var transformPanelOrgId = null;
var transformPanelUploadId = -1;
var transformPanelUserId = -1;
var tabs=null;


function ChangeTabs(nTabIndex)
{   
    tabs.set('activeIndex', nTabIndex);
}


function transformPanelClose() {
   ajaxFetchTransformStatus(transformPanelUploadId);
}

function transformPanelCancel() {
	ajaxtransformRequest(transformPanelUploadId,transformPanelOrgId, transformPanelUserId);
	}

function ajaxtransformRequest(uploadId, orgId, userId) {
	transformPanelOrgId = orgId;  
	transformPanelUploadId=uploadId;
	transformPanelUserId=userId;
	transformPanel.setBody("<center>Loading...<br/><img src=\"images/rel_interstitial_loading.gif\"/></center>");

	transformPanel.show();
    YAHOO.util.Connect.asyncRequest('POST', 'Transform_input.action',
        {
            success: function(o) {
    	        transformPanel.setBody(o.responseText);
    	        $('#Transform_selMapping').sSelect({ddMaxHeight: '300px'});
    	     },
            
            failure: function(o) {
            	transformPanel.setBody("<h1>Error</h1>");
            }
        }, "uploadId=" + uploadId);
    
   
}

function ajaxBeginTransform(selMapping,ignoreInvalid) {
	transformPanel.setBody("<center>Loading...<br/><img src=\"images/rel_interstitial_loading.gif\"/></center>");

	transformPanel.show();
    YAHOO.util.Connect.asyncRequest('POST', 'Transform.action',
        { 
            success: function(o) {
    	        if(o.responseText.indexOf('errorMessage')>-1 || o.responseText.indexOf('errortransform')>-1){
    	        	
    			     transformPanel.setBody(o.responseText);
    			     if(document.getElementById("previewTabs")!=undefined){
    			    	 columns = [{key:"Missing XPath",label:"Missing XPaths",sortable:false,width: "300px"}];
    		               	
    		             source = new YAHOO.util.DataSource(YAHOO.util.Dom.get("missingTable"));
    		             source.responseType = YAHOO.util.DataSource.TYPE_HTMLTABLE;
    		             source.responseSchema = {fields: [{key:"Missing XPath"}]};
    		                   
    		             table = new YAHOO.widget.ScrollingDataTable("missingContainer",columns, source, {caption:"Missing XPaths.",width: "790px"});   
    		               
    		                
    		             columns = [{key:"Invalid XPath",label:"Invalid XPaths",sortable:false,width: "300px"}];
    		               	
    		             source = new YAHOO.util.DataSource(YAHOO.util.Dom.get("invalidTable"));
    		             source.responseType = YAHOO.util.DataSource.TYPE_HTMLTABLE;
    		             source.responseSchema = {fields: [{key:"Invalid XPath"}]};
    		             table = new YAHOO.widget.ScrollingDataTable("invalidContainer",columns, source, {caption:"Invalid XPaths.",width: "790px"});
    		                
    		             var tabs = new YAHOO.widget.TabView("previewTabs");
	    			  }else{
    		         $('#Transform_selMapping').sSelect({ddMaxHeight: '300px'});
	    			  }
    	        }
    	        else{
    	        	
    	        	 transformPanel.hide();
    			     transformPanelClose() ;
    	        }
            },
            
            failure: function(o) {
            	transformPanel.setBody("<h1>Error</h1>");
            }
        }, "selMapping=" +selMapping+"&uploadId="+transformPanelUploadId+"&continueInvalid="+ignoreInvalid);
    
   
}

function ajaxDeleteTransform(uploadId) {
    YAHOO.util.Connect.asyncRequest('POST', 'Transform.action',
        { 
            success: function(o) {
         	   ajaxFetchTransformStatus(uploadId);
            }
            ,
            
            failure: function(o) {
            	alert("Error deleting transformation!")
            }
        }, "&uploadId="+uploadId+"&action=delete");
    
   
}

