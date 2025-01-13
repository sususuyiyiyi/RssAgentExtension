document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  chrome.storage.local.get(['accessToken', 'datasetId'], function(result) {
    if (result.accessToken) {
      document.getElementById('accessToken').value = result.accessToken;
    }
    if (result.datasetId) {
      document.getElementById('datasetId').value = result.datasetId;
    }
  });

  // Save settings
  document.getElementById('saveButton').addEventListener('click', function() {
    const accessToken = document.getElementById('accessToken').value;
    const datasetId = document.getElementById('datasetId').value;
    
    chrome.storage.local.set({
      accessToken: accessToken,
      datasetId: datasetId
    }, function() {
      alert('Settings saved successfully!');
    });
  });

  // Import current page
  document.getElementById('importButton').addEventListener('click', function() {
    chrome.storage.local.get(['accessToken', 'datasetId'], function(result) {
      if (!result.accessToken || !result.datasetId) {
        alert('Please save your Coze settings first!');
        return;
      }

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        
        const requestData = {
          dataset_id: result.datasetId,
          document_bases: [
            {
              name: currentTab.title,
              source_info: {
                web_url: currentTab.url,
                document_source: 1
              },
              update_rule: {
                update_type: 1,
                update_interval: 24
              }
            }
          ],
          chunk_strategy: {
            separator: "\n\n",
            max_tokens: 800,
            remove_extra_spaces: false,
            remove_urls_emails: false,
            chunk_type: 1
          }
        };

        fetch('https://api.coze.cn/open_api/knowledge/document/create', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${result.accessToken}`,
            'Content-Type': 'application/json',
            'Agw-Js-Conv': 'str'
          },
          body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
          alert('Page imported successfully!');
        })
        .catch(error => {
          alert('Error importing page: ' + error.message);
        });
      });
    });
  });
});
