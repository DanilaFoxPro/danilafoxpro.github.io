
const hashmark = window.location.hash.substr(1);
const projectIdentifier = parseInt( hashmark );

if( isNaN(projectIdentifier) ) {
        displayProjectList();
} else {
        displaySpecificProject( projectIdentifier );
}

function displayProjectList()
{
        console.log( "Would display project list." );
}

function displaySpecificProject( Identifier )
{
        console.log( "Would display specific project: " + Identifier.toString() );
}