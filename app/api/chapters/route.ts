

/**
* dear diary,
*nag import nextresponse para sa pag handle ng response sa API route which is para gumana
*Ito ung mga setups ko para sa API route ng chapters
* gagamit ng fs module para magbasa at magsulat sa chapters.json file
* fs/promises para gumamit ng async/await na syntax
* path module para mag handle ng file paths
* gumamit ng importpath para makuha ang tamang path ng file
*
* 
*/
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

/**
*
*const filePath para ma locate ang registrants.json file sa data folder
* ung filepath name lang yan for path joining para instead na paggamit ng hardcoded path
*ginamit ang process.cwd() para makuha ang current working directory ng project
*tapos dinefine ko yung path papunta sa data folder at registrants.json file
*/

const filePath = path.join(process.cwd(), "data", "registrants.json");

/**
*
*nag define ako type Chapter para ma specify yung structure ng chapter object sa json ko.
* 
*/
type Chapter = {
  id: number;
  chapterName: string;
};

/**
*
*ito ung handlers para sa pag read at write ng chapters sa registrants.json file
* bali sa kada function kinall ko yung readChapters para each function ay capable of reading ung registrants.json file
* sa writeChapters naman ginamit ko sya dun sa pag update at delete ng chapter especially since they have to modify the data sa json
* 
*/


async function readChapters(): Promise<Chapter[]> {
  const file = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(file);
  return data.chapters as Chapter[];
}
//write ekek
async function writeChapters(chapters: Chapter[]): Promise<void> {
  const file = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(file);
  data.chapters = chapters;
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
*update chapter handler
*nagamit ko na ung async func dito na ni import ko kanina sa fs/promises
*first step is to parse the request body to get the chapter id and new chapter name
*technically dapat may validation check para ma ensure na both id at chapterName ay present sa request body
*then mag read ng existing chapters gamit ang readChapters function
*hahanapin yung chapter na may matching id using !body id para ma validate kung existing ba sya
*if hindi sya mahanap, mag return ng 404 response na chapter not found
*if nahanap yung chapter, i update yung chapterName property with the new name from request body
*then isusulat ulit yung updated chapters array pabalik dun sa registrants.json file gamit ang writeChapters function
*tas mag return ng success response na may updated chapter data if successful
*if may error during the process, mag catch ng error at mag return ng 500 response with error message catch (err: any) {
    return NextResponse.json(
        { 
            message: "Failed to update chapter", 
            error: err.message 
        },
        { status: 500 });
  }
* 
* 
*/

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.chapterName) {
      return NextResponse.json(
        { 
            message: "Chapter id and name required" },
        { status: 400 });
    }
    //validation ccheck nya if chapter exists
    const chapters = await readChapters();
    const chapter = chapters.find((c: Chapter) => c.id === Number(body.id));
    if (!chapter) return NextResponse.json(
        { message: "Chapter not found" },
        { status: 404 });
    //dito mag update ng chapter name
    chapter.chapterName = body.chapterName;
    await writeChapters(chapters);

    return NextResponse.json(
        { 
            message: "Chapter updated successfully", 
            data: chapter 
        }, 
            { status: 200 }
        );
    
  } catch (err: any) {
    return NextResponse.json(
        { 
            message: "Failed to update chapter", 
            error: err.message 
        },
        { status: 500 });
  }
}

/**
*Delete chapter handler
*similar din sa update handler, need din na i parse yung request body to get the chapter id
*then ccheck ulit kung present yung id sa body if not return error response
*mag read ng existing chapters gamit ang readChapters function
*hahanapin yung index ng chapter na may matching id using findIndex method i ccompare nya if equal
*if hindi sya mahanap, mag return ng 400 response na Chapter id required may mini validation na sya
*next validation, compare ulit if index is -1 which means hindi nahanap yung chapter nonexistence sa array
*if nahanap yung chapter, gagamitin yung splice method para i remove yung chapter sa chapters array
*then isusulat ulit yung updated chapters array pabalik dun sa registrants.json file gamit ung writeChapters function
*tas mag return ng success response na may message na chapter deleted successfully if successful
*if may error during the process, i ccatch ng error at mag return ng 500 response with error message
* then yey done!
*/

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json(
        { message: "Chapter id required" },
        { status: 400 });
    }
    //validation check if chapter exists
    const chapters = await readChapters();
    const index = chapters.findIndex((c: Chapter) => c.id === Number(body.id));
    if (index === -1) return NextResponse.json(
        { message: "Chapter not found" }, 
        { status: 404 });

    chapters.splice(index, 1);
    await writeChapters(chapters);

    return NextResponse.json(
        { message: "Chapter deleted successfully" }, 
        { status: 200 });

  } catch (err: any) {
    return NextResponse.json(
        { message: "Failed to delete chapter", error: err.message }, 
        { status: 500 });
  }
}






