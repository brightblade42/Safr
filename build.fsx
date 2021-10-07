#r "paket: groupref Build //"
#load ".fake/build.fsx/intellisense.fsx"

open System.IO
open Fake.Core
open Fake.IO
open Fake.DotNet
open Fake.IO.Globbing.Operators
open Fake.IO.FileSystemOperators
open Fake.Core.TargetOperators

module Tools =
    let private findTool tool winTool =
        let tool = if Environment.isUnix then tool else winTool
        match ProcessUtils.tryFindFileOnPath tool with
        | Some t -> t
        | _ ->
            let errorMsg =
                tool + " was not found in path. " +
                "Please install it and make sure it's available from your path. "
            failwith errorMsg

    let private runTool (cmd:string) args workingDir =
        let arguments = args |> String.split ' ' |> Arguments.OfArgs
        Command.RawCommand (cmd, arguments)
        |> CreateProcess.fromCommand
        |> CreateProcess.withWorkingDirectory workingDir
        |> CreateProcess.ensureExitCode
        |> Proc.run
        |> ignore

    let dotnet cmd workingDir =
        let result =
            DotNet.exec (DotNet.Options.withWorkingDirectory workingDir) cmd ""
        if result.ExitCode <> 0 then failwithf $"'dotnet %s{cmd}' failed in %s{workingDir}"

    let femto = runTool "femto"
    let node = runTool (findTool "node" "node.exe")
    let yarn = runTool (findTool "yarn" "yarn.cmd")


let publishPath = Path.getFullName "publish"
//let srcPath = Path.getFullName "src"
let srcPath = "/Users/ryan/dev/web/eyemetric/"
let clientSrcPath = srcPath </> "apps/multicam"
let serverSrcPath = srcPath </> "services/Safr.Server"
let appPublishPath = publishPath </> "app"

// Targets
let clean proj = [ proj </> "bin"; proj </> "obj" ] |> Shell.cleanDirs

Target.create "Clean" (fun _ ->
     clientSrcPath  |> clean
     serverSrcPath  |> clean
     [ appPublishPath ] |> Shell.cleanDirs
)
Target.create "InstallClient" (fun _ ->
    printfn "====== IN THE INSTALLCLIENT TARGET ====="
    printfn "Node version:"
    Tools.node "--version" clientSrcPath
    printfn "Yarn version:"
    Tools.yarn "--version" clientSrcPath
    Tools.yarn "install --frozen-lockfile" clientSrcPath
)

Target.create "Publish" (fun _ ->
    printfn "====== IN THE PUBLISH TARGET ====="
    let publishArgs = $"publish -c Release -o \"%s{appPublishPath}\""
    [ appPublishPath ] |> Shell.cleanDirs
    Tools.dotnet publishArgs serverSrcPath
    [ appPublishPath </> "appsettings.Development.json" ] |> File.deleteAll
    //Tools.yarn $"snowpack build" clientSrcPath
    //Shell.cp_r "./build" $"%s{appPublishPath}/public"

)


Target.create "Run" (fun _ ->
    printfn "====== IN THE RUN TARGET ====="
    let server = async {
        Tools.dotnet "watch run" serverSrcPath
    }
    let client = async {
        //Tools.dotnet $"fable watch --outDir %s{fableBuildPath} --run yarn snowpack dev" clientSrcPath
        Tools.yarn $"snowpack dev" clientSrcPath
    }
    [server;client]
    |> Async.Parallel
    |> Async.RunSynchronously
    |> ignore
)

Target.create "fun" (fun _ ->
    printfn "====== IN THE FUN TARGET ====="
    let server = async {
        Tools.dotnet "watch run" serverSrcPath
    }
    [server]
    |> Async.Parallel
    |> Async.RunSynchronously
    |> ignore
)

"InstallClient"
    ==> "Publish"

"InstallClient"
    ==> "Run"

Target.runOrDefaultWithArguments "Run"
