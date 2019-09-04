import React = require("react");


const topsImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAB9CAMAAACFzP1xAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAADAFBMVEUAAAAKAgIMCwsPEA8TAAESDA0aAAETExMXFxgYGBcbGxsjAAElDg4sAAEpDg4iEREyAgM1CQk7DAw5DhA7ExM8Fxg+GxwkJCQnKCcoJygqKioxMTE8PDxKCwxUBwdUGRlAHyBBIyREKyxHMjNINjdJOztbJiZqAABiFxh1AwNxHRxkKSlqODh8KCh3NzhAP0BEQ0NHSEhLRERMS0tUSkpZTk5QT1BUVFRbVlZbW1tfYF9jTk5tQEBjU1NhW1twRERwSUl4Q0R5T09zT1BzUFB6VVV9WltiYmJtbGx1aWh6ZWV0dHR6cnJ6eHd9fHyKAACEFxeTAACXCAeVCwuaAACfBwiYCAeaDAyZDhCbEA+TExKVHByaEhKZGBecGhqeIB+CISGDLy+OJCOMKyuGPj6LMzOLOjmULCyaIiKcKiqVMjGUOjubNTWeOTmlAACiEhOhHByrEhGrHBykIyOhKiqrIiKoKyyjNDSkPDyqNDSvODizOjmFQkGCSkqLRUWJSkqLUE+EWlqURESSTUyaREWbTEuVVVSUXV2dVVSbWlqEZWWNY2KMaWqCfX2OcHGWZmWTbGyeZ2ibbGyUc3OedneaenqkQkKgR0ijS0usQ0OtSkqjUFCiW1urVVWqWFizQkKzTU28TE2yVVSzWlq4UlK4WFe6XV2lYmOsZGSta2ukc3OienutdHSqenq0YGG1bW66YWG4Z2i9aGe8a2uzcXGze3u8cnK9enrCaWnBc3PEfHzKeXmFhISMhISLioqTi4udgoKTk5ObkpKamJebmpqigYGki4uuh4irjIytkI+mk5KlnZ2skJGrnZ20g4OxjI2/hIW7ioq0lpazmJezm5u6mJe4np+kpKSrq6u5paW1tbW7u7vEgYHEjYzKhITNh4jKjY3ClZXBmZnMkpLSjIvUkZHSnZ3QoJ/CpKTCqqrOpabLrq7HuLjap6jbt7bjvLzDw8PMwMDLy8vYyMjb0tHd2trkxsbm2Njx3t7r5OTs6eny6+v08vL49fT+/v4AAAAoWEfxAAABAHRSTlP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AU/cHJQAAAAlwSFlzAAAScwAAEnMBjCK5BwAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAACjZJREFUaEPtWQ10VMUVfqzK6gIVlEPa3WU9YGHdipwlSwnbqrU9rUndNi/vcI9pKcY2YZEQG1ITCxyirUD9Q6wtjYefCgg9KgqaNkD5CchikqYlUKHU3QQiUSgntIFSA2whmzm9c2d2s2Tf24SQrS2H7zE7M/femW++OzPvwUFhqcZVw9AUShHORBmsSopgPycZ0qSh32FFEVcdQ1bIVB1Iy8SWyVdjwsoWsgU83OOusQfsvOEJ2AO0bdVBxcfHmauzfD7y1Ljx11Rdo/jMvM+RwOA9bGo6bOOBii9EhjNKIEjdoBKs5o3sGiVEEwaDnixaRDDD+wk32IM0sCnkJj8hgcETsgebPNQTDPYgzYIT76VKUZYgQxZv+AJBWqspEDJTjDtIIrMDYgWEBAZrqDo7tIuaWU1UWWsCJBk1CHANgiEzFKCZTb4mG6+lBl9WqIbXhAQGU/CMO0SLlxpsmeaaAG98O6hMpiVyDbRGn1IT4eQ3etOyKEtSg89UE+E1IYFB2XXRHBKLj+0D7ijvBpX3YvsgNCi+M9dhbQ1lYBTCHhIalOzDvCYkMtgzlQyKU9xe/mvy2ryUJUuGLYNyYplso8OluNEmGm4PHS5rBlVop6GERIb+xqfJMEAZEAfTAJMRZIQADuuGRAYMu37gwIGDBg0ZMmTo0KHDht06fMSIUaNGj77982PGpKd7PBMnZUzK8Ez0pKenjxlz++jRo0aNGDH81luGDR2KIwYNGoSDr+dcElf3PvQXujFk+i6BeCERrL6afftqfPGfwjQZlZXpjr1JEWnZ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';
const wisDotImgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQAAAEk0dWoyYwwqhBEthhQuiBUxhhUziRgyhxo1ix05jBc2kBw1kB46kCA2jSE8jis8jCI8kSk+kh9Ajx5AkyRAjilCjiVAkSdIlytEkyxFmC1IlC1ImDBGlTFHmjJKljNLmThOmjVQlzZQmjlRlztSnD1YnT1VoD9aoUFVnUNZnkJWoURboUldokZgo0xhpExiqFFlpVJlqVNpplRpqVhrplptq11xrF5xsGFzrWV5rmN1sWV5smJ5vGh2smt8tG19uHB/tm2BtW6BuHKCtnSFuXWIt3aIunmGunuLvH+QvX6OwH+Rwa4ZL6okPL4iLbYjM4MeRoEpU5csSJMtUq9Xb79eb71sf8YJD8YTG8YZHskQFskUHMkZHscWIMUcJMkWIModJcweKNAdJ8cgJscgKMogJssgKMwoLs0rM80xNc4zOs45P9AtNNIxN9A1O9E6Ps88QtE7Q9JBQ9NEStNJTdVMU9hNU9ZVWdZeYdpcYttfadpkad1rcdxwdN10eN55fOF2et5+guF8gYOHt4CNvoKRvqeIqoGOwYSTwYaYwYmVw4yaxI2cyJGdxpGdyJOhxpSiyZaozJqlzJypzJ6p0KCrzqOt0aiu0qWxzqWx0qq006222a241a642bC21rC22LG71rS92bi+27XA1rXA2rvD273I3b3E4LvL5cebstmao9Okrt60vuKGieSNkeSSleWUmuWbnOmUm+iZneaeoOmdouGqr+mipOmlqemqrOutsOyzte20ue27u/C5ve+9wfG+w8HG3cPK3sjO3sLG4cTL4cnO4sbQ4svS5M7U6NHV5dHV6NPZ5tXa6djX6drd69rf8N3h7N7i8O7Bwu/JyPHDxfHFyfLKzPLO0PHQzvPS0/XV2PTY1/Xa2/7V0/nc3vbd4OHk7uTp7unq7+Pl8eXp8unn8urs8+7u+O3w9e7x+fbj4/bo5/fp6Pjk5Pnm6fnq6vPv9Pvw7fHy9vP0+fb49/X5+/v08/j2+vz49v7+/gAAAAAAAAAAAAAAADIDePIAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBwYWludC5uZXQgNC4xLjb9TgnoAAAqQUlEQVR4XsWdfXwbx5nf1V7szUzNzI0/gbcrSgF0ulVKGgxMCgGOBntwZKI2nHtrr59rlVJ1wDhkWJ9PiSzrGFdO4stHqnmCRLFkxDMRJyVcwembrKRO6ihK7s6KwYMloQzkOvYpdR255CG0PnHkEEfJ+wf7PLODV+4uli++fi0Ti11gMT/MzPM884pNy+8xBjA74leZJk+8R7xHQgLh5CxKQEpj2i2Mc8bItpPmGfmiDWXDhcyOqApF1Akz1UaSMNrq72jXKGXT5qlLGg0k5Rs2iA0VAkk8H1A4oV4fYVybEonOcka7npyduzju51y7Is6lvaAND+UbN4ANEyISaCwFKGPdU898Y1xjNDCHp36DMH9OXHxaZyQujg6roEnk2CU9JG+wTjZGiJlQ4ITKtdgiHk3/Cg3g6XnqoeN4AogxvlUchDlUmh48mqREP78RGbMBQnSfz+d/QSTQ2MlVvWgezswVl+AhQ6ieNc8YU62cF+BxLsA8LawdD6OM7xTX5M3WzLqFqCp+u0w1ldzOzC+6ytgtrDMvj1/UGUVR39A5b2PeFBz6uLpLXFuvlPUJuREECVv97SrjOqalqDPt4yJVFZKUhkRdAWbaGEvD4xi8PkOwvlzSuHZCXMt6CafytmthPUIMY0RlW0agSoy3daexHC3qjJvVucIooUEsQ8hJH2OYIzHKA4bGugpGSuO/JirYeco9nK9DytqF4Md3MnYIHw1ZL4x2lYfkIZwslAwjRVj7S/LEhMZa5qH+hzgdMWJkc9qIQRkTlwKceSM9HwGvKW+/WtYqRBSX4h2Mm87CWIQ0A2HOdfPIWByP+s8bRoF42J+Z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';


export const header = <header>
    <div>
        <img height="70" src={topsImgSrc}/>
        <img height="70" src={wisDotImgSrc}/>
    </div>
    <div id="title-bar">
        <h2>Wisconsin Traffic Operations and Safety Laboratory</h2>
        <h2>The WisTransPortal System</h2>
    </div>
    {/*The WisTransPortal crash database contains information on all reported crashes in Wisconsin from 1994*/}
    {/*through the current year.*/}
    {/*The&nbsp;<a*/}
    {/*href="http://transportal.cee.wisc.edu/documents/database/crash/crash-data-user-guide.pdf"> Crash Data*/}
    {/*User Guide</a>&nbsp;*/}
    {/*provides definitions for most data elements available through the online system.*/}
    {/*Complete information on the WisTransPortal crash database is available from the&nbsp;*/}
    {/*<a href="http://transportal.cee.wisc.edu/documents/database/crash-data.html">Crash Database*/}
    {/*Documentation</a>&nbsp;page.*/}
    {/*User feedback is welcome. Please send comments to <a*/}
    {/*href="mailto:crash-data@topslab.wisc.edu">crash-data@topslab.wisc.edu</a>.*/}

</header>;

export const disclamerH3 = <h3>Disclaimer</h3>;

export const disclamerDiv = <div>
    The WISLR crash map is maintained by UW TOPS Lab on behalf of the
    Wisconsin Department of Transportation for research and
    planning purposes. Any other use, while not prohibited,
    is the sole responsibility of the user.
    <br/><br/>
    Crashes are mapped from 2005 through the current year.
    The WISLR crash map is updated on a monthly basis from police
    reported crash locations on the DT4000 crash report.

    <br/><br/>
    See the February 2019 <a href="/documents/applications/crash-data/WISLR_Crash_Mapping_Update_201902.pdf"
                             target="_blank">WISLR
    Crash Mapping Update</a> summary document for additional information about the crash
    mapping data source.<br/><br/>
</div>;

export const aboutH3 = <h3>About</h3>;

// export const aboutDiv = <div className="about-div">
//     <b>About the CMAA Crash Map</b>
//     <p>
//         The Crash Mapping and Analysis (CMAA) system provides an interactive mapping tool to display and select
//         Wisconsin traffic crashes from the WisTransPortal database. The CMAA is updated on a nightly basis with
//         preliminary Wisconsin DT4000 crash data. In order for a crash to be displayed on the CMAA crash map, it must be
//         geo-coded to a latitude and longitude coordinate pair corresponding to the location of the crash on the roadway.
//         Crashes that have not been geo-coded are counted in the total number of crashes returned for a particular search
//         but will not be displayed on the map. Unmapped crashes will be listed in the “Unmapped Crashes” section of the
//         CMAA left-side panel.
//     </p>
//     <p><b>CMAA Data Source</b></p>
//     <p>
//         The CMAA crash map includes Wisconsin traffic crashes from 1998 to the present data. Crash location
//         geo-coordinates are taken from the following sources:
//     </p>
//     <ul>
//         <li>2017 - Present: Geo-coordinates provided by law enforcement on the Wisconsin DT4000 police crash report.
//         </li>
//         <li>2005 - 2016: WisTransPortal automated geo-processing of Wisconsin MV4000 crash locations by the UW TOPS
//             Lab.
//         </li>
//         <li>1998 - 2004: Latitude and longitude values derived from WisDOT GIS shape files of State Trunk Highway
//             reference point “RP” coded crashes. Local road crashes are not included.
//         </li>
//     </ul>
//     <p><b>Naming Conventions</b></p>
//     <p>
//         The CMAA displays the crash latitude and longitude coordinates under the names CMAALAT and CMAALONG,
//         respectively. These names correspond to the WisTransPortal “DT4000” data source. In order to maintain backwards
//         compatibility, the WisTransPortal element names for the CMAA locations differ depending on which data source is
//         being used.
//     </p>
//     <ul>
//         <li>MV4000 – WISLR_LATDECDG, WISLR_LONDECDG</li>
//         <li>DT40000 – CMAALAT, CMAALONG</li>
//     </ul>
//     <p>
//         Although the elements names differ, the underlying values are the same and represent the best available crash
//         locations in the WisTransPortal.
//     </p>
//
//     <p><b>Disclaimer</b></p>
//
//     The CMAA crash map is maintained by UW TOPS Lab on behalf of the Wisconsin Department of Transportation for research
//     and planning purposes. Any other use, while not prohibited, is the sole responsibility of the user.
//
//     {/*<p><b>Disclaimer</b></p>*/}
//
//     {/*{disclamerDiv}*/}
// </div>;

export const aboutDiv = <div>
    <b>About the CMAA Crash Map</b>
    <p>
        The WisTransPortal CMAA crash map provides an interactive "Crash Mapping and Analysis" tool
        to display and select Wisconsin traffic crashes from the WisTransPortal database. The CMAA
        retrieves data in real-time from the WisTransPortal which is updated on a nightly
        basis from preliminaty Wisconsin DT4000 crash extracts provided by the Wisconsin Department
        of Transportation (WisDOT). The TOPS Lab maintains the CMAA crash map for research
        purposes and as a service to WisDOT.
    </p>
    <p><b>CMAA Data Source</b></p>
    <p>
        The WisTransPortal database includes geo-coded Wisconsin traffic crashes from 1998 to the
        present day. In order for a crash to be displayed on the CMAA crash map, however, it must
        be geo-coded in the WisTransPortal database with latitude and longitude coordinates. Crashes
        that have not been geo-coded are counted in the total number of crashes returned for a
        particular query but will not be displayed on the map. Unmapped crashes will be listed in the
        "Unmapped Crashes" section of the CMAA interface.
    </p><p>
    CMAA crash geo-coordinates are taken from the following sources:
</p>
    <ul>
        <li>2017 - Present: Geo-coordinates provided by law enforcement on the Wisconsin DT4000 police crash report.
        </li>
        <li>2005 - 2016: WisTransPortal automated geo-processing of Wisconsin MV4000 crash locations by the UW TOPS
            Lab.
        </li>
        <li>1998 - 2004: Latitude and longitude coordinates derived from WisDOT GIS shape files of State Trunk Highway
            reference point "RP" coded crashes. Local road crashes are not included.
        </li>
    </ul>
    <p><b>Naming Conventions</b></p>
    <p>
        In order to maintain backwards compatibility, the WisTransPortal maintains two sets of element names for
        the CMAA latitude and longitude coordinate values depending on which data source is being used:
    </p>
    <ul>
        <li>MV4000 - WISLR_LATDECDG, WISLR_LONDECDG</li>
        <li>DT4000 - CMAALAT, CMAALONG</li>
    </ul>
    <p>Although the two sets of element names differ, they refer to the same coordinate values and
        represent the best available crash geo-coordinate locations in the WisTransPortal.
        By convention, the CMAA uses the "DT4000" names when it displays crash information. </p>
    <p><b>System Requirements</b></p>
    <p>
        The CMAA crash map is designed to work with all primary web browsers used by WisDOT. As
        of the intial CMAA release, that includes IE 11, Edge, and Chrome.
    </p>
    <p><b>Disclaimer</b></p>
    <p>
        The CMAA crash map is maintained by UW TOPS Lab on behalf of the Wisconsin
        Department of Transportation for research and planning purposes. Any
        other use, while not prohibited, is the sole responsibility of the user.
    </p>
    <p>
        See the WisTransPortal
        <a href="http://transportal.cee.wisc.edu/documents/database/crash-data.html" target="_blank">Crash
            Database Documentation</a> or contact the TOPS Lab
        at <a href="mailto:crash-data@topslab.wisc.edu">crash-data@topslab.wisc.edu</a> for additional information.
    </p>
</div>;

export const helpH3 = <h3>Help</h3>;

export const helpDiv = <div id="help-div">

    <h3>Initial Extent</h3>

    <div>
        <span style={{backgroundPosition: '0 0'}} className="help-extent"/>
        <p>
            Set the map to initial extent of the crashes
        </p>
    </div>

    <h3>Cluster Toggle</h3>

    <div>
        <span style={{backgroundPosition: '-23px 0'}} className="help-cluster"/>
        <span style={{backgroundPosition: '2px 0'}} className="help-cluster"/>
        <p>
            Toggle the crash point layer to display as individual points or as clusters.
        </p>
    </div>

    <h3>Clear Selection</h3>

    <div>
        <span style={{backgroundPosition: '3px 0'}} className="help-clear-selection"/>
        <p>
            Clear all selected crashes. This button also currently clears markup from the measure tool.
        </p>
    </div>

    <h3>Selection Tools</h3>

    <div>
        Selections can be made by use of a rectangular extent, free form polygon, or a line buffered to user defined
        lateral distance. The selection tools are disabled when the measure tool is active.
    </div>

    <div>
        <span style={{backgroundPosition: '-1px 0'}} className="help-selection-tools"/>
        <label>Select by rectangular extent</label>
        <p>
            Single click to define corners of the rectangular extent
        </p>
    </div>

    <div>
        <span style={{backgroundPosition: '-1px -108px'}} className="help-selection-tools"/>
        <label>Select by buffered line</label>
        <p>
            Lateral distance in feet can be set when the tool is activated. Use single clicks to
            define the vertices and double click to end the line.
        </p>
    </div>

    <div>
        <span style={{backgroundPosition: '-1px -24px'}} className="help-selection-tools"/>
        <label>Select by polygon</label>
        <p>
            Use single clicks to define the vertices and double click to finish the polygon. Avoid
            self intersections of the polygon.
        </p>
    </div>


    <h3>Selection Methods</h3>

    <div>
        Selection methods are available to create new selections as well as to add to an existing selection
        or subset or remove from the existing selection
    </div>

    <div>
        <span style={{backgroundPosition: '-1px 0'}} className="help-selection-mode"/>
        <label>New Selection</label>
        <p>
            Crashes within the extent will be selected. Any previously selected crashes not within the new
            extent will not be included in the selection.
        </p>
    </div>

    <div>
        <span style={{backgroundPosition: '-32px 0'}} className="help-selection-mode"/>
        <label>Add to selection</label>
        <p>
            Crashes within the new selection extent will be added to the existing selection.
        </p>
    </div>

    <div>
        <span style={{backgroundPosition: '-93px 0'}} className="help-selection-mode"/>
        <label>Subset selection</label>
        <p>
            Select only crashes that are within an existing selection.
            The remaining selection will be only those crashes that were previously selected and are within
            the defined selection extent.
        </p>
    </div>
    <div>
        <span style={{backgroundPosition: '-62px 0'}} className="help-selection-mode"/>
        <label>Remove from selection</label>
        <p>
            Selected crashes within the defined extent will be unselected.
        </p>
    </div>

    <h3>Measure Tool</h3>

    <div>
        <span style={{backgroundPosition: '0 0'}} className="help-measure"/>
        <p>
            Measure distances on the map. Measure sketch lines and labels can be cleared using 'Clear Selection'
        </p>
    </div>


</div>;