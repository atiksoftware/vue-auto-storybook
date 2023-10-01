export default interface VueFile {
    path: string;
    name: string | undefined;
    extension: string | undefined;
    category: string | undefined;
    subCategory: string | undefined;
    content: string | undefined; 

    storyBookPath: string | undefined;
    storyBookName: string | undefined;
    storyBookContent: string | undefined;
    storyBookExists: boolean;
}