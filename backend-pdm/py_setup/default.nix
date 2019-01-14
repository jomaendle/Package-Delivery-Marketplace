with import <nixpkgs> {};
stdenv.mkDerivation rec {
  name = "env";
  env = buildEnv { name = name; paths = buildInputs; };
  buildInputs = [
    python36Full
    python36Packages.flask
  ];
  # Customizable development shell setup
  shellHook = ''
    alias python='python'
  '';
}