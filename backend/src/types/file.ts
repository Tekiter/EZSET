export interface FileInfo {
    id: string
    filename: string
    size: number
    uploader: string
    timestamp: Date
}

export interface FileXRef {
    target: string
    ref: string
}
