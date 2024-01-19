{
  'targets': [
    {
      'target_name': 'blsct',
      'include_dirs': [
         '../../src/bls/include',
         '../../src/bls/mcl/include',
         '../../include',
         '../..',
      ],
      'libraries': [
        '../../../src/bls/lib/libbls384_256.so',
        '../../../src/bls/mcl/lib/libmcl.so',
      ],
      'sources': [
        '../../src/lib.cpp',
        'blsct_wrap.cxx',
      ],
      'cflags': [
        '-std=c++17',
       ],
       'cflags!': [ '-fno-exceptions' ],
       'cflags_cc!': [ '-fno-exceptions' ]
    }
  ]
}
