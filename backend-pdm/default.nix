with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    python36
    python36Packages.flask
    python36Packages.pyproj 
    (python27Packages.callPackage ./gcloud.nix {})    
  ];
  # Customizable development shell setup
  shellHook = ''
    alias python='python'
  '';
}
