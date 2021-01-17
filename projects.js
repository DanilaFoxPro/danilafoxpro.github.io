
/* When a page is loaded, page's content is generated depending
 * on the presence of a valid hashmark, that would contain the
 * project identifier (an integer), if the project details are
 * to be displayed. Abscence of a hashmark means that project
 * list is to be displayed.
 */
window.onload = function(){
        
        const hashmark = window.location.hash.substr(1);
        const projectIdentifier = parseInt( hashmark );
        
        if( isNaN(projectIdentifier) ) {
                displayProjectList();
        } else {
                displaySpecificProject( projectIdentifier );
        }
        
}

/* Would get called when a page hashmark is changed. */
window.addEventListener( 'hashchange', function() {
        // Hax!
        window.onload();
} );

function displayProjectList()
{
        console.log( "Displaying project list." );
        
        const projectList = document.createElement('div');
        projectList.setAttribute( 'id', 'project_container' );
        
        const projects = projectRetrieveAll();
        
        for( const project of projects ) {
                const html = generateProjectItem( project );
                const item = HTMLToElement( html );
                
                projectList.appendChild( item );
        }
        
        document.title = "Projects";
        document.body.innerHTML = "";
        document.body.appendChild( projectList );
        
}

function displaySpecificProject( identifier )
{
        console.log( "Displaying specific project: " + identifier.toString() );
        
        var generatedHTML = fileAsString( 'templates/project_detail.template' );
        
        const project = projectByIdentifier( identifier );
        
        generatedHTML = generatedHTML.replace( /\${name}/g        , project.name );
        generatedHTML = generatedHTML.replace( /\${description}/g , project.description );
        
        const projectContent = HTMLToElement( generatedHTML );
        
        const projectContainer = document.createElement('div');
        projectContainer.setAttribute( 'id', 'project_container' );
        projectContainer.appendChild( projectContent );
        
        document.title = "Project: " + project.name;
        document.body.innerHTML = "";
        document.body.appendChild( projectContainer );
        
}

function projectClicked( identifier )
{
        console.log( "Clicked on a project: " + identifier.toString() );
        window.location = "./projects.htm#" + identifier.toString();
}

/* Generates HTML for a project item, from project object. */
function generateProjectItem( project )
{
        
        if( project.identifier == -1 ) {
                console.error(
                        "Trying to create HTML for a project without an identifier."
                        + " Project object: " + project.toString()
                );
        }
        
        var generatedHTML = fileAsString( 'templates/project_list_item.template' );
        
        if( project.done === true ) {
                generatedHTML = generatedHTML.replace( /\${name}/g, project.name + ' &#10003;' );
        } else {
                generatedHTML = generatedHTML.replace( /\${name}/g, project.name );
        }
        
        generatedHTML = generatedHTML.replace( /\${identifier}/g  , project.identifier );
        generatedHTML = generatedHTML.replace( /\${description}/g , project.description );
        
        return generatedHTML;
        
}

function projectInsertDefaultFields( project ) {
        
        if( !('identifier' in project) ) {
                project.identifier = -1;
        }
        
        if( !('name' in project) ) {
                project.name = "Unnamed";
        }
        
        if( !('description' in project) ) {
                project.description = "";
        }
        
        if( !('done' in project) && project.done === true ) {
                project.done = false;
        }
        
}

function projectRetrieveAll() {
        const projectsString = fileAsString( 'projects.json' );
        const projectsParsed = JSON.parse( projectsString );
        
        var index = 0;
        for( const project of projectsParsed ) {
                project.identifier = index;
                index += 1;
                projectInsertDefaultFields( project );
        }
        
        return projectsParsed;
}

function projectByIdentifier( identifier ) {
        
        const projects = projectRetrieveAll();
        
        for( project of projects ) {
                if( project.identifier === identifier ) {
                        return project;
                }
        }
        
        return null;
        
}

function HTMLToElement( html ) {
        
        var element = document.createElement('div');
        
        // Hax!
        element.innerHTML = html;
        element = element.childNodes[0];
        
        return element;
        
}

function fileAsString( file )
{
        var   xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
        const url = file;
        
        xmlhttp.open( "GET", url, false );
        xmlhttp.send();
        
        return xmlhttp.status == 200 ? xmlhttp.responseText : null;
}