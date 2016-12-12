'use strict';
(function(window, document) {

    function onLoad() {
        document.getElementById('do_delete').style.display = 'none';
        document.getElementById('do_delete').addEventListener('click', onDoDelete, false);
        getOrganizationList();
    }

    function getOrganizationList() {
        document.getElementById('organization-list').innerHTML = 'LOADING...';
        httpGet('/organizations').then((res) => {
            var organizations = res.map((dataRow) => {
                return [dataRow.id, dataRow.name, dataRow.created_at];
            });
            showOrganizations(organizations);
        });
    }

    function showOrganizations(lines) {
        //Clear previous data
        document.getElementById('organization-list').innerHTML = '';
        var table = document.createElement('table');
        var headerRow = table.insertRow(-1);
        headerRow.insertCell(-1).appendChild(document.createTextNode('id'));
        headerRow.insertCell(-1).appendChild(document.createTextNode('name'));
        headerRow.insertCell(-1).appendChild(document.createTextNode('created on'));
        var selectAll = document.createElement('input');
        selectAll.type = 'checkbox';
        selectAll.name = 'select_all';
        selectAll.id = 'select_all';
        var selectAllCell = headerRow.insertCell(-1);
        selectAllCell.appendChild(document.createTextNode('Select All'));
        selectAllCell.appendChild(selectAll);
        selectAll.addEventListener('click', onSelectAllOrganizations, false);

        headerRow.insertCell(-1).appendChild(document.createTextNode(''));
        for (var i = 0; i < lines.length; i++) {
            var row = table.insertRow(-1);
            var orgId = row.insertCell(-1);
            var orgName = row.insertCell(-1);
            var orgCreated = row.insertCell(-1);
            var orgCheckBox = row.insertCell(-1);
            orgId.appendChild(document.createTextNode(lines[i][0]));
            orgName.appendChild(document.createTextNode(lines[i][1]));
            orgCreated.appendChild(document.createTextNode(lines[i][2]));
            //checkbox
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = lines[i][0];
            checkbox.id = lines[i][0];
            orgCheckBox.appendChild(checkbox);
        }
        document.getElementById('organization-list').appendChild(table);
        document.getElementById('do_delete').style.display = 'block';
    }

    function onSelectAllOrganizations() {
        //get the checkboxes and convert the htmlcollection to an array
        var inputs = [].slice.call(document.getElementById('organization-list').getElementsByTagName('input'));
        var checkboxes = inputs.forEach((input) => {
            if (input.type === 'checkbox' && input.id !== 'select_all') {
                input.checked = true;
            }
        });
    }

    function onDoDelete() {
        var firstConfirm = confirm('Are you sure you want to delete these records?');
        if (firstConfirm === true) {
            var secondConfirm = confirm('Are you really sure you want to delete these records??');
            //delete
            if (secondConfirm === true) {
                document.getElementById('organization-list').innerHTML = 'Deleting Records...';
                var deletePromises = [];
                var organizationInputs = document.getElementById('organization-list').getElementsByTagName('input');
                for (var i = 0; i < organizationInputs.length; i++) {
                    var input = organizationInputs[i];
                    if (input.type === 'checkbox' && input.checked === true && input.id !== 'select_all') {
                        deletePromises.push(httpDelete('/organizations/' + input.id));
                    }
                }
                Promise.all(deletePromises).then(getOrganizationList);
            }

        }

    }

    //listener for window load event
    window.addEventListener('DOMContentLoaded', onLoad, false);

})(window, document);
